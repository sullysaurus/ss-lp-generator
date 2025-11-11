# Serverless Guide Reader

This module provides a serverless-compatible way to read SuperSummary study guides from PDF files.

## Why This Exists

The MCP (Model Context Protocol) server uses stdio transport, which requires spawning child processes. This works great locally but doesn't work in serverless environments like Vercel because:

- Vercel Functions are stateless and can't maintain persistent processes
- The `child_process` module is restricted in serverless runtimes
- stdio/process communication isn't available

## How It Works

### Local Development
- Uses the MCP server (`mcp-server/index.ts`) with stdio transport
- Provides full MCP protocol support for Claude Desktop integration
- Spawns a Node.js child process to run the MCP server

### Production (Vercel)
- Automatically detects serverless environment via `process.env.VERCEL`
- Reads PDF files directly from the filesystem
- Parses PDFs using `pdf-parse` library
- Caches parsed content for performance

## Usage

The `lib/mcp/client.ts` wrapper automatically chooses the right implementation:

```typescript
import { readGuide, searchGuides, getGuideSummary } from '@/lib/mcp/client';

// Works both locally and in production
const guide = await readGuide('guide://guide1');
const results = await searchGuides('symbolism');
const summary = await getGuideSummary(1);
```

## Environment Detection

```typescript
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME != null;
```

- **Local**: Uses MCP server via stdio
- **Vercel**: Uses direct file reading
- **AWS Lambda**: Uses direct file reading (future)

## Available Guides

1. **guide://guide1** - "A Respectable Woman" by Kate Chopin
2. **guide://guide2** - "Teaching Critical Thinking" by bell hooks
3. **guide://guide3** - "The Corrections" by Jonathan Franzen

## Performance

- **Cold Start**: PDFs are parsed on first request (~100-500ms)
- **Warm Requests**: Content is cached in memory (~1-5ms)
- **Bundle Size**: Minimal - only includes reader code in production

## Deployment

No special configuration needed! Just deploy to Vercel and it will automatically use the serverless implementation.

```bash
git push  # Vercel auto-deploys
```

## Testing

### Test Locally (uses MCP server)
```bash
pnpm dev
# MCP server runs as child process
```

### Test Production Build
```bash
VERCEL=1 pnpm build
VERCEL=1 pnpm start
# Uses serverless reader
```
