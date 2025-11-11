# Deployment Guide for Production

## What Was Fixed

The MCP (Model Context Protocol) server was failing in production because it used **stdio transport** which requires spawning child processes - something Vercel's serverless environment doesn't support.

### Solution Implemented

Created a **hybrid approach** that automatically detects the environment:

- **Local Development**: Uses MCP server with stdio transport (works with Claude Desktop)
- **Production (Vercel)**: Reads PDFs directly from filesystem (serverless-compatible)

## Deploying to Production

### 1. Code is Already Pushed ✅

All changes are committed and pushed to your repository.

### 2. Vercel Will Auto-Deploy

Vercel will automatically deploy when you push. The deployment will:
- Build successfully (verified locally)
- Detect `VERCEL=1` environment variable
- Use serverless guide reader automatically
- Generate lesson plans without MCP server process

### 3. Seed Production Data (Optional)

To show your test data and prompt versions on production:

```bash
# Connect to production database temporarily
# Update .env.local with production POSTGRES_URL

# Run the import script
npx tsx scripts/import-data.ts

# Restore local database URL
```

**Or** run this on Vercel via their CLI:
```bash
vercel env pull  # Get production env vars
npx tsx scripts/import-data.ts
```

## What's Included in Production

✅ **All UI Features**:
- Lesson plan generation (/chat)
- Prompt version management (/prompts)
- Test comparisons (/)
- Slides presentation (/slides)

✅ **Serverless Guide Reading**:
- Automatically reads 3 SuperSummary guides from `docs/` folder
- Caches parsed content for performance
- No MCP server process needed

✅ **Data Ready to Import**:
- 13 prompt versions (v1-v3 + demos)
- 2 prompt tests with full results
- All exported in `scripts/seed-data.json`

## Verifying Production Deployment

1. **Check Vercel Dashboard**: https://vercel.com/dashboard
2. **Test Lesson Generation**: Go to your production URL and try generating a lesson plan
3. **Check Logs**: Vercel dashboard → Your project → Logs

Look for:
```
✅ Using serverless guide reader (detected VERCEL=1)
✅ Initialized guides cache with 3 guides
```

## Troubleshooting

### If Lesson Generation Fails

1. **Check Environment Variables** in Vercel dashboard:
   - `ANTHROPIC_API_KEY` is set
   - `POSTGRES_URL` points to production database

2. **Check Build Logs**:
   - Build should complete successfully
   - No TypeScript errors
   - PDFs should be included in deployment

3. **Check Function Logs**:
   - Look for guide loading errors
   - PDF parsing should work in serverless

### If You Still See MCP Errors

The code automatically falls back to serverless mode. If you see MCP-related errors:

1. Check `VERCEL` environment variable is set
2. Ensure `lib/guides/reader.ts` is deployed
3. Verify `docs/` folder with PDFs is included

## Local Development

Everything still works locally as before:
- MCP server runs via stdio
- Claude Desktop integration works
- No changes needed to your workflow

## Architecture

```
┌─────────────────────────────────────────┐
│           Production (Vercel)           │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │   Next.js API Routes            │  │
│  │   /api/chat                     │  │
│  └──────────┬──────────────────────┘  │
│             │                          │
│             ▼                          │
│  ┌─────────────────────────────────┐  │
│  │   lib/mcp/client.ts             │  │
│  │   (detects VERCEL=1)            │  │
│  └──────────┬──────────────────────┘  │
│             │                          │
│             ▼                          │
│  ┌─────────────────────────────────┐  │
│  │   lib/guides/reader.ts          │  │
│  │   - Reads PDFs directly         │  │
│  │   - Serverless compatible       │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Summary

Your app is now **production-ready** and will work perfectly on Vercel! 🎉

The lesson plan generator will automatically use the serverless guide reader, and all your demo data is ready to be imported to show visitors how the system works.
