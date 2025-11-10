# SuperSummary Guides MCP Server

This MCP (Model Context Protocol) server provides access to three guide documents as resources that can be used by Claude and other MCP-compatible AI tools.

## Overview

The server exposes three PDF guides from the `docs/` directory:
- Guide 1 (`guide://guide1`)
- Guide 2 (`guide://guide2`)
- Guide 3 (`guide://guide3`)

## Features

### Resources
The server provides three guide resources that can be read directly. Each resource:
- Contains the full text extracted from the PDF
- Is accessible via a unique URI (e.g., `guide://guide1`)
- Returns content in plain text format

### Tools
The server provides two tools:

1. **search_guides** - Search across all three guides for specific content
   - Input: `query` (string) - The search term
   - Output: Matches from all guides with context

2. **get_guide_summary** - Get a summary of a specific guide
   - Input: `guide_number` (1, 2, or 3)
   - Output: Guide metadata and first 500 characters

## Installation & Setup

### 1. Build the Server

From the project root:
```bash
pnpm mcp:build
```

### 2. Configure Claude Desktop

Add the server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "supersummary-guides": {
      "command": "node",
      "args": [
        "/absolute/path/to/supersummary/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Replace `/absolute/path/to/supersummary` with the actual path to this project.

### 3. Restart Claude Desktop

After updating the configuration, restart Claude Desktop to load the MCP server.

## Development

### Running in Development Mode

```bash
pnpm mcp:dev
```

This uses `tsx` to run the TypeScript file directly without building.

### Running the Built Server

```bash
pnpm mcp:start
```

## Usage Examples

Once configured, you can use the server in Claude Desktop:

### Reading a Guide
"Can you read guide://guide1 and summarize it?"

### Searching Across Guides
"Search all guides for 'authentication'"

### Getting a Guide Summary
"Get me a summary of guide 2"

## Project Structure

```
mcp-server/
├── index.ts          # Main server implementation
├── package.json      # Package configuration
├── tsconfig.json     # TypeScript configuration
├── dist/            # Compiled JavaScript (generated)
└── README.md        # This file
```

## Troubleshooting

### Server Not Appearing in Claude Desktop
1. Check that the path in `claude_desktop_config.json` is correct and absolute
2. Ensure you've restarted Claude Desktop
3. Check the Claude Desktop logs for errors

### Build Errors
Make sure all dependencies are installed:
```bash
pnpm install
```

### PDF Reading Errors
Ensure the PDF files exist in the `docs/` directory:
- `docs/guide1.pdf`
- `docs/guide2.pdf`
- `docs/guide3.pdf`

## Technical Details

- **Runtime**: Node.js with ES modules
- **SDK**: `@modelcontextprotocol/sdk` v1.21.1
- **PDF Parser**: `pdf-parse` v2.4.5
- **Transport**: stdio (standard input/output)

## License

Same as the main project.
