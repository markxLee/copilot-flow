#!/usr/bin/env node
/**
 * Fetch external content from Confluence or Jira.
 * 
 * Usage:
 *   node fetch_external.mjs <url> --type confluence|jira
 *   node fetch_external.mjs "https://xxx.atlassian.net/wiki/x/abc" --type confluence
 *   node fetch_external.mjs "https://xxx.atlassian.net/browse/PROJ-123" --type jira
 * 
 * Environment Variables (in .env file):
 *   CONFLUENCE_USERNAME: Your Confluence email
 *   CONFLUENCE_TOKEN: Your Confluence API token
 *   JIRA_USERNAME: Your Jira email
 *   JIRA_TOKEN: Your Jira API token
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
function loadEnv() {
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) {
    console.error('Error: .env file not found at', envPath);
    console.error('Run: cp .github/scripts/env.example .github/scripts/.env');
    process.exit(1);
  }
  
  const envContent = readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
  
  return env;
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = { url: null, type: null };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--type' && args[i + 1]) {
      result.type = args[i + 1];
      i++;
    } else if (!args[i].startsWith('--')) {
      result.url = args[i];
    }
  }
  
  return result;
}

// Detect type from URL
function detectType(url) {
  if (url.includes('atlassian.net') && (url.includes('/wiki') || url.includes('confluence'))) {
    return 'confluence';
  }
  if (url.includes('atlassian.net') && url.includes('/browse/')) {
    return 'jira';
  }
  return null;
}

// Create Basic Auth header
function createAuthHeader(username, token) {
  const credentials = Buffer.from(`${username}:${token}`).toString('base64');
  return `Basic ${credentials}`;
}

// Fetch with error handling
async function fetchWithAuth(url, auth) {
  const response = await fetch(url, {
    headers: {
      'Authorization': auth,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    redirect: 'follow'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Follow redirects to get final URL
async function getRedirectedUrl(url, auth) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'Authorization': auth },
      redirect: 'follow'
    });
    return response.url;
  } catch {
    return url;
  }
}

// Extract page ID from Confluence URL
function extractPageId(url) {
  const parsed = new URL(url);
  const pathParts = parsed.pathname.split('/');
  
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === 'pages' && pathParts[i + 1]) {
      return pathParts[i + 1];
    }
  }
  
  return null;
}

// Extract issue key from Jira URL
function extractIssueKey(url) {
  const parsed = new URL(url);
  const pathParts = parsed.pathname.split('/');
  
  for (const part of pathParts) {
    if (part.includes('-') && /^[A-Z]+-\d+$/i.test(part)) {
      return part.toUpperCase();
    }
  }
  
  return null;
}

// Fetch Confluence page
async function fetchConfluencePage(url, auth) {
  console.error(`Fetching Confluence page: ${url}`);
  
  // Follow redirects for short links
  const finalUrl = await getRedirectedUrl(url, auth);
  console.error(`Redirected to: ${finalUrl}`);
  
  const pageId = extractPageId(finalUrl);
  if (!pageId) {
    return { error: 'Could not extract page ID from Confluence URL' };
  }
  
  const parsed = new URL(finalUrl);
  const baseUrl = `${parsed.protocol}//${parsed.host}`;
  
  try {
    // Try API v2 first
    const apiUrl = `${baseUrl}/wiki/api/v2/pages/${pageId}?body-format=ATLAS_DOC_FORMAT`;
    const attachmentsUrl = `${baseUrl}/wiki/api/v2/pages/${pageId}/attachments`;
    
    const pageData = await fetchWithAuth(apiUrl, auth);
    
    // Fetch attachments
    let attachments = [];
    try {
      const attachmentsData = await fetchWithAuth(attachmentsUrl, auth);
      attachments = (attachmentsData.results || []).map(att => ({
        id: att.id,
        title: att.title,
        fileName: att.fileName,
        fileSize: att.fileSize,
        mediaType: att.mediaType,
        downloadUrl: `${baseUrl}/wiki/download/attachments/${pageId}/${att.fileName}`
      }));
    } catch {
      // Attachments fetch failed, continue without
    }
    
    return {
      title: pageData.title || '',
      content: pageData.body?.atlas_doc_format?.value || '',
      attachments,
      url,
      type: 'confluence'
    };
    
  } catch (e) {
    // Fallback to API v1
    console.error(`API v2 failed, trying v1: ${e.message}`);
    
    try {
      const apiUrlV1 = `${baseUrl}/wiki/rest/api/content/${pageId}?expand=body.storage`;
      const attachmentsUrlV1 = `${baseUrl}/wiki/rest/api/content/${pageId}/child/attachment`;
      
      const data = await fetchWithAuth(apiUrlV1, auth);
      
      let attachments = [];
      try {
        const attachmentsData = await fetchWithAuth(attachmentsUrlV1, auth);
        attachments = (attachmentsData.results || []).map(att => ({
          id: att.id,
          title: att.title,
          fileName: att.fileName || att.title,
          fileSize: att.extensions?.fileSize,
          mediaType: att.extensions?.mediaType,
          downloadUrl: att._links?.download || ''
        }));
      } catch {
        // Attachments fetch failed
      }
      
      return {
        title: data.title || '',
        content: data.body?.storage?.value || '',
        attachments,
        url,
        type: 'confluence'
      };
      
    } catch (e2) {
      return { error: `Failed to fetch Confluence page: ${e2.message}` };
    }
  }
}

// Fetch Jira issue
async function fetchJiraIssue(url, auth) {
  console.error(`Fetching Jira issue: ${url}`);
  
  const issueKey = extractIssueKey(url);
  if (!issueKey) {
    return { error: 'Could not extract issue key from Jira URL' };
  }
  
  const parsed = new URL(url);
  const baseUrl = `${parsed.protocol}//${parsed.host}`;
  const apiUrl = `${baseUrl}/rest/api/2/issue/${issueKey}`;
  
  try {
    const data = await fetchWithAuth(apiUrl, auth);
    
    return {
      key: data.key || '',
      title: data.fields?.summary || '',
      description: data.fields?.description || '',
      status: data.fields?.status?.name || '',
      assignee: data.fields?.assignee?.displayName || null,
      url,
      type: 'jira'
    };
    
  } catch (e) {
    return { error: `Failed to fetch Jira issue: ${e.message}` };
  }
}

// Main
async function main() {
  const args = parseArgs();
  
  if (!args.url) {
    console.error('Usage: node fetch_external.mjs <url> --type confluence|jira');
    process.exit(1);
  }
  
  // Auto-detect type if not specified
  const type = args.type || detectType(args.url);
  if (!type) {
    console.error(JSON.stringify({ error: 'Could not determine source type from URL. Use --type' }));
    process.exit(1);
  }
  
  // Load environment
  const env = loadEnv();
  
  const username = env[`${type.toUpperCase()}_USERNAME`];
  const token = env[`${type.toUpperCase()}_TOKEN`];
  
  console.error(`Using authentication for ${type}: username=${username}, token=${token ? '***' : 'NOT SET'}`);
  
  if (!token) {
    console.error(JSON.stringify({ 
      error: 'Authentication required. Set environment variables in .env file',
      required: [`${type.toUpperCase()}_USERNAME`, `${type.toUpperCase()}_TOKEN`]
    }));
    process.exit(1);
  }
  
  const auth = createAuthHeader(username || '', token);
  
  let result;
  if (type === 'confluence') {
    result = await fetchConfluencePage(args.url, auth);
  } else if (type === 'jira') {
    result = await fetchJiraIssue(args.url, auth);
  } else {
    result = { error: 'Unsupported type' };
  }
  
  console.log(JSON.stringify(result, null, 2));
}

main().catch(e => {
  console.error(JSON.stringify({ error: e.message }));
  process.exit(1);
});
