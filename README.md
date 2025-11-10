# SuperSummary Lesson Plan Generator

AI-powered lesson plan generator with prompt testing capabilities, built with Next.js and the AI SDK.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Vercel AI SDK with xAI Grok models
- **MCP**: Model Context Protocol for serving study guides
- **Database**: Neon Postgres with Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **Auth**: NextAuth.js

## Features

### Lesson Plan Generator
- Generate custom lesson plans from 3 literary study guides
- AI-powered responses using Grok models
- Searchable guide selector with detailed descriptions
- Multi-modal support (text and file attachments)

### Prompt Testing Interface
- Document and compare AI prompt iterations
- Test prompts across multiple guides
- Track model settings (temperature, tokens, etc.)
- Add commentary and iteration notes
- Full CRUD operations for test management

### Study Guides (via MCP)
1. "A Respectable Woman" by Kate Chopin
2. "Teaching Critical Thinking" by bell hooks
3. "The Corrections" by Jonathan Franzen

## How to Use

### Getting Started
On the home screen, click the **"Generate Lesson Plan"** button to start creating educational content. You can also ask questions in the chat to learn about the guides, features, and how MCP works.

### Generate a Lesson Plan
1. Click **"Generate Lesson Plan"** button in the chat input
2. Select a guide from the searchable dropdown
3. Choose your desired lesson plan type (single lesson, week-long unit, etc.)
4. The AI will generate a comprehensive lesson plan with objectives, activities, and assessments

### Test Prompts
1. Navigate to **"Prompt Tests"** from the sidebar
2. Click **"New Test"** to create a prompt test
3. Fill in:
   - Title and prompt text
   - Model and temperature settings
   - Test outputs for each guide
   - Commentary on results
4. Save and compare different prompt iterations

### Chat Features
- Ask questions about the study guides
- Request specific teaching materials
- Upload files for context
- View and continue previous conversations
- Ask "how does this work" or "where do guides come from" for help

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm db:migrate # Setup database or apply latest database changes
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000).
