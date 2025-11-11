import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// Define the guide resources
const GUIDES = [
	{
		uri: "guide://guide1",
		name: "A Respectable Woman",
		description: "Kate Chopin short story - SuperSummary study guide",
		mimeType: "application/pdf",
		filePath: path.join(process.cwd(), "docs/guide1.pdf"),
	},
	{
		uri: "guide://guide2",
		name: "Teaching Critical Thinking",
		description: "bell hooks educational text - SuperSummary study guide",
		mimeType: "application/pdf",
		filePath: path.join(process.cwd(), "docs/guide2.pdf"),
	},
	{
		uri: "guide://guide3",
		name: "The Corrections",
		description: "Jonathan Franzen novel - SuperSummary study guide",
		mimeType: "application/pdf",
		filePath: path.join(process.cwd(), "docs/guide3.pdf"),
	},
];

// Cache for parsed guides
let guidesCache: Map<string, string> | null = null;

async function initializeGuides(): Promise<Map<string, string>> {
	if (guidesCache) {
		return guidesCache;
	}

	guidesCache = new Map();

	try {
		// Import pdf-parse - it's a CommonJS module
		const pdfParseModule: any = await import("pdf-parse");
		const pdfParse = pdfParseModule.default || pdfParseModule;

		for (const guide of GUIDES) {
			try {
				const dataBuffer = await fs.readFile(guide.filePath);
				const pdfData = await pdfParse(dataBuffer);
				guidesCache.set(guide.uri, `# ${guide.name}\n\n${pdfData.text}`);
			} catch (error) {
				console.error(`Error loading ${guide.name}:`, error);
				guidesCache.set(
					guide.uri,
					`# ${guide.name}\n\nError loading guide content.`,
				);
			}
		}
	} catch (error) {
		console.error("Error with pdf-parse:", error);
		// Fallback: add placeholder content
		for (const guide of GUIDES) {
			guidesCache.set(
				guide.uri,
				`# ${guide.name}\n\nPDF file available but text extraction unavailable in this environment.`,
			);
		}
	}

	return guidesCache;
}

const handler = createMcpHandler(
	(server) => {
		// Define readGuide tool (replaces resource reading)
		server.tool(
			"readGuide",
			"Read the full content of a SuperSummary study guide. Available guides: guide://guide1 (A Respectable Woman by Kate Chopin), guide://guide2 (Teaching Critical Thinking by bell hooks), guide://guide3 (The Corrections by Jonathan Franzen)",
			{
				uri: z
					.string()
					.describe(
						"The guide URI: guide://guide1, guide://guide2, or guide://guide3",
					),
			},
			async ({ uri }) => {
				console.log(`[MCP API] Reading guide: ${uri}`);
				const cache = await initializeGuides();
				const content = cache.get(uri);

				if (!content) {
					throw new Error(`Guide not found: ${uri}`);
				}

				console.log(
					`[MCP API] Successfully read guide: ${uri} (${content.length} characters)`,
				);

				return {
					content: [
						{
							type: "text" as const,
							text: content,
						},
					],
				};
			},
		);

		// Define search_guides tool
		server.tool(
			"search_guides",
			"Search across all three SuperSummary guides for specific content",
			{
				query: z
					.string()
					.describe("The search query to find in the guides"),
			},
			async ({ query }) => {
				const cache = await initializeGuides();
				const results: string[] = [];
				const searchQuery = query.toLowerCase();

				for (const [uri, content] of cache.entries()) {
					const guide = GUIDES.find((g) => g.uri === uri);
					if (!guide) continue;

					const lowerContent = content.toLowerCase();
					if (lowerContent.includes(searchQuery)) {
						// Find context around the match
						const index = lowerContent.indexOf(searchQuery);
						const start = Math.max(0, index - 100);
						const end = Math.min(
							content.length,
							index + query.length + 100,
						);
						const context = content.substring(start, end);

						results.push(`**${guide.name}**:\n...${context}...`);
					}
				}

				return {
					content: [
						{
							type: "text" as const,
							text:
								results.length > 0
									? `Found "${query}" in the following guides:\n\n${results.join("\n\n")}`
									: `No results found for "${query}"`,
						},
					],
				};
			},
		);

		server.tool(
			"get_guide_summary",
			"Get a summary of a specific SuperSummary guide",
			{
				guide_number: z
					.number()
					.int()
					.min(1)
					.max(3)
					.describe("The guide number (1, 2, or 3)"),
			},
			async ({ guide_number }) => {
				const guide = GUIDES[guide_number - 1];

				if (!guide) {
					throw new Error(`Invalid guide number: ${guide_number}`);
				}

				const cache = await initializeGuides();
				const content = cache.get(guide.uri);

				if (!content) {
					throw new Error(`Could not load guide: ${guide.uri}`);
				}

				// Get first 500 characters as a summary
				const summary = content.substring(0, 500);

				return {
					content: [
						{
							type: "text" as const,
							text: `**${guide.name} Summary**\n\n${summary}...`,
						},
					],
				};
			},
		);
	},
	{
		capabilities: {
			resources: {},
			tools: {},
		},
	},
	{
		basePath: "/api/mcp",
		maxDuration: 60,
		verboseLogs: true,
	},
);

export { handler as GET, handler as POST };
