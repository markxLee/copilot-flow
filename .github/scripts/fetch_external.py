"""
Fetch external content from Confluence or Jira.

Usage:
    python fetch_external.py confluence <page_id> [--debug]
    python fetch_external.py jira <issue_key> [--debug]

Environment Variables (required):
    CONFLUENCE_USERNAME: Your Confluence username
    CONFLUENCE_TOKEN: Your Confluence API token
    JIRA_USERNAME: Your Jira username  
    JIRA_TOKEN: Your Jira API token

Create a .env file in the same directory with these variables.
"""

import sys
import os
import requests
import json
import argparse
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

def fetch_confluence_page(url, auth):
    """Fetch Confluence page content"""
    # Handle short links by following redirects
    try:
        redirect_response = requests.head(url, auth=auth, allow_redirects=True)
        final_url = redirect_response.url
        print(f"Redirected to: {final_url}")
    except:
        final_url = url

    # Extract page ID from URL
    parsed = urlparse(final_url)
    path_parts = parsed.path.split('/')
    page_id = None
    for i, part in enumerate(path_parts):
        if part == 'pages' and i + 1 < len(path_parts):
            page_id = path_parts[i + 1]
            break

    if not page_id:
        return {"error": "Could not extract page ID from Confluence URL"}

    # Try API v2 first (recommended)
    api_url = f"{parsed.scheme}://{parsed.netloc}/wiki/api/v2/pages/{page_id}?body-format=ATLAS_DOC_FORMAT"
    attachments_url = f"{parsed.scheme}://{parsed.netloc}/wiki/api/v2/pages/{page_id}/attachments"

    try:
        # Fetch page info with content
        response = requests.get(api_url, auth=auth)
        response.raise_for_status()
        page_data = response.json()

        # Fetch attachments
        attachments_response = requests.get(attachments_url, auth=auth)
        attachments = []
        if attachments_response.status_code == 200:
            attachments_data = attachments_response.json()
            attachments = [
                {
                    "id": att.get("id"),
                    "title": att.get("title"),
                    "fileName": att.get("fileName"),
                    "fileSize": att.get("fileSize"),
                    "mediaType": att.get("mediaType"),
                    "downloadUrl": f"{parsed.scheme}://{parsed.netloc}/wiki/download/attachments/{page_id}/{att.get('fileName')}"
                }
                for att in attachments_data.get("results", [])
            ]

        return {
            "title": page_data.get("title", ""),
            "content": page_data.get("body", {}).get("atlas_doc_format", {}).get("value", ""),
            "attachments": attachments,
            "url": url,
            "type": "confluence"
        }
    except Exception as e:
        # Fallback to API v1 if v2 fails
        try:
            api_url_v1 = f"{parsed.scheme}://{parsed.netloc}/wiki/rest/api/content/{page_id}?expand=body.storage"
            attachments_url_v1 = f"{parsed.scheme}://{parsed.netloc}/wiki/rest/api/content/{page_id}/child/attachment"

            response = requests.get(api_url_v1, auth=auth)
            response.raise_for_status()
            data = response.json()

            # Fetch attachments v1
            attachments_response = requests.get(attachments_url_v1, auth=auth)
            attachments = []
            if attachments_response.status_code == 200:
                attachments_data = attachments_response.json()
                attachments = [
                    {
                        "id": att.get("id"),
                        "title": att.get("title"),
                        "fileName": att.get("fileName") or att.get("title"),
                        "fileSize": att.get("extensions", {}).get("fileSize"),
                        "mediaType": att.get("extensions", {}).get("mediaType"),
                        "downloadUrl": att.get("_links", {}).get("download", "")
                    }
                    for att in attachments_data.get("results", [])
                ]

            return {
                "title": data.get("title", ""),
                "content": data.get("body", {}).get("storage", {}).get("value", ""),
                "attachments": attachments,
                "url": url,
                "type": "confluence"
            }
        except Exception as e2:
            return {"error": f"Failed to fetch Confluence page: {str(e2)}"}

def fetch_jira_issue(url, auth):
    """Fetch Jira issue details"""
    parsed = urlparse(url)
    path_parts = parsed.path.split('/')
    issue_key = None
    for part in path_parts:
        if '-' in part and part.split('-')[0].isalpha():
            issue_key = part
            break

    if not issue_key:
        return {"error": "Could not extract issue key from Jira URL"}

    api_url = f"{parsed.scheme}://{parsed.netloc}/rest/api/2/issue/{issue_key}"

    try:
        response = requests.get(api_url, auth=auth)
        response.raise_for_status()
        data = response.json()

        return {
            "key": data.get("key", ""),
            "title": data.get("fields", {}).get("summary", ""),
            "description": data.get("fields", {}).get("description", ""),
            "status": data.get("fields", {}).get("status", {}).get("name", ""),
            "assignee": data.get("fields", {}).get("assignee", {}).get("displayName", "") if data.get("fields", {}).get("assignee") else None,
            "url": url,
            "type": "jira"
        }
    except Exception as e:
        return {"error": f"Failed to fetch Jira issue: {str(e)}"}

def main():
    parser = argparse.ArgumentParser(description='Fetch content from Confluence or Jira')
    parser.add_argument('url', help='URL to fetch')
    parser.add_argument('--type', choices=['confluence', 'jira'], help='Type of source (auto-detected if not specified)')

    args = parser.parse_args()

    # Determine type from URL if not specified
    if not args.type:
        if 'atlassian.net' in args.url and ('wiki' in args.url or 'confluence' in args.url):
            args.type = 'confluence'
        elif 'atlassian.net' in args.url or 'jira' in args.url:
            args.type = 'jira'
        else:
            print(json.dumps({"error": "Could not determine source type from URL"}))
            sys.exit(1)

    # Get auth from environment variables only
    username = os.getenv(f"{args.type.upper()}_USERNAME")
    token = os.getenv(f"{args.type.upper()}_TOKEN")
    
    print(f"Using authentication for {args.type}: username={username}, token={'***' if token else None}")
    
    if token:
        auth = (username or '', token)
    else:
        print(json.dumps({"error": "Authentication required. Set environment variables in .env file"}))
        sys.exit(1)

    # Fetch content
    if args.type == 'confluence':
        result = fetch_confluence_page(args.url, auth)
    elif args.type == 'jira':
        result = fetch_jira_issue(args.url, auth)
    else:
        result = {"error": "Unsupported type"}

    print(json.dumps(result, indent=2))

if __name__ == '__main__':
    main()