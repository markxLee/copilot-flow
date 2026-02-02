# External Source Fetcher Scripts

Scripts to fetch content from external sources like Confluence and Jira for Copilot Flow work intake.

## fetch_external.py

Fetches content from Confluence pages or Jira issues with authentication.

### Prerequisites

- Python 3.6+
- requests library: `pip install requests`
- python-dotenv: `pip install python-dotenv`

### Setup

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your credentials:
   ```bash
   # Edit with your actual values
   CONFLUENCE_USERNAME=your.email@company.com
   CONFLUENCE_TOKEN=your_api_token
   JIRA_USERNAME=your.email@company.com
   JIRA_TOKEN=your_api_token
   ```

3. The script will automatically load credentials from `.env` file.

### Usage

After setting up `.env` file:

```bash
# Confluence page (credentials loaded from .env)
python fetch_external.py "https://company.atlassian.net/wiki/spaces/PROJ/pages/123456/Page+Title" --type confluence

# Jira issue (credentials loaded from .env)
python fetch_external.py "https://company.atlassian.net/browse/PROJ-123" --type jira
```

**⚠️ Security Note:** Never pass credentials as command line arguments. Always use `.env` file.

### Authentication

**🔒 Security First:** Credentials are loaded from `.env` file only. Command line arguments for credentials are not supported for security reasons.

1. **API Token** (recommended):
   - Generate token in Atlassian Account Settings
   - Set in `.env` file: `CONFLUENCE_TOKEN=your_api_token`
   - Username can be email or empty string

2. **Environment Variables:**
   - `CONFLUENCE_USERNAME` (optional, defaults to email from token)
   - `CONFLUENCE_TOKEN` (required)
   - `JIRA_USERNAME` (optional)
   - `JIRA_TOKEN` (required)

### Output

Returns JSON with:
- For Confluence: `title`, `content` (full page content in ATLAS_DOC_FORMAT), `attachments` array, `url`, `type`
  - `content`: Full page content as JSON (headings, paragraphs, tables, media, etc.)
  - `attachments`: Array of objects with `id`, `title`, `fileName`, `fileSize`, `mediaType`, `downloadUrl`
- For Jira: `key`, `title`, `description`, `status`, `assignee`, `url`, `type`
- On error: `{"error": "error message"}`

### API Versions Supported

**Confluence:**
- API v2 (recommended): `/wiki/api/v2/pages/{id}?body-format=ATLAS_DOC_FORMAT` - includes full content and attachments
- API v1 (fallback): `/wiki/rest/api/content/{id}` - deprecated but still works

**Jira:**
- API v2: `/rest/api/2/issue/{key}`

### Environment Variables

Set these in a `.env` file in the same directory as the script:

- `CONFLUENCE_USERNAME` (optional)
- `CONFLUENCE_TOKEN` (required for Confluence)
- `JIRA_USERNAME` (optional)
- `JIRA_TOKEN` (required for Jira)

### Security Notes

- Never commit `.env` file to version control (add it to `.gitignore`)
- Use API tokens instead of passwords
- The `env.example` file is safe to commit (contains no real credentials)
- Regularly rotate your API tokens