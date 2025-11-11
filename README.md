# SuperSummary Lesson Plan Generator

AI-powered lesson plan generator with prompt testing capabilities, built with Next.js and the AI SDK.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Vercel AI SDK with Claude Sonnet 4.5 and Gemini 2.0 Flash
- **MCP**: Model Context Protocol for serving study guides
- **Database**: Neon Postgres with Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **Auth**: NextAuth.js
- **Demo Mode**: Optional mock responses for cost-free demonstrations

## Features

### Lesson Plan Generator
- Generate custom lesson plans from 3 literary study guides
- AI-powered responses with model options:
  - **Claude Sonnet 4.5**: Anthropic's most capable model
  - **Gemini 2.0 Flash**: Google's fast, cost-effective model
- Searchable guide selector with grade level and duration options
- Multi-modal support (text and file attachments)

### Demo Mode
- Enable with `NEXT_PUBLIC_DEMO_MODE=true`
- Instant mock responses without API costs
- Perfect for presentations and demonstrations
- Visual banner indicates demo mode is active

### Prompt Testing Interface
- Document and compare AI prompt iterations
- Test prompts across multiple guides simultaneously
- Track model settings (temperature, top P, frequency/presence penalties, max tokens)
- Version management with auto-incrementing versions
- Load previous prompt versions for testing
- Export/import test data
- Add commentary and iteration notes

### Study Guides (via MCP)
1. **"A Respectable Woman"** by Kate Chopin - Short story exploring propriety and desire
2. **"Teaching Critical Thinking"** by bell hooks - Educational essay on critical pedagogy
3. **"The Corrections"** by Jonathan Franzen - Novel examining family and American culture

### Additional Features
- **Slides**: Presentation deck about the application features
- **Video Demo**: Embedded YouTube demonstration
- **Prompt Versions**: Track and manage prompt evolution
- **Spreadsheet**: Link to analysis and tracking

## How to Use

### Generate a Lesson Plan
1. Click the **"Generate Lesson Plan"** button on the home screen
2. Select a guide from the searchable dropdown
3. Choose grade level (optional: K-5, 6-8, 9-12, College)
4. Select duration (optional: single class, multi-day, week-long unit)
5. The AI will read the full guide and generate a comprehensive lesson plan with:
   - Learning objectives aligned to standards
   - Detailed activities with timelines
   - Assessment strategies
   - Differentiation for diverse learners
   - Homework and extensions

### Test and Compare Prompts
1. Navigate to **"Prompts"** from the sidebar to manage prompt versions
2. Navigate to **"Prompt Tests"** to run tests
3. Click **"New Test"** to create a prompt test
4. Select a prompt version or use the active prompt
5. Configure model settings with helpful tooltips
6. **Run the test** to generate outputs for all three guides
7. Review results and save when satisfied
8. Compare different prompt versions and model configurations

### Navigation
- **Lesson Plans**: Main chat interface for generating lesson plans
- **Prompts**: Manage and version your prompt templates
- **Slides**: View presentation about the application
- **View Code**: GitHub repository
- **Spreadsheet**: Analysis and tracking data

### Chat Features
- Natural conversation about the study guides
- Request specific teaching materials or activities
- Upload files for additional context
- View and continue previous conversations
- Ask "how does this work" for help

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run SuperSummary LP Generator. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

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
