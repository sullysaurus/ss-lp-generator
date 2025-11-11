import fs from "fs/promises";
import path from "path";

// PDF parsing - we'll use a lightweight approach
// Note: pdf-parse doesn't work well in serverless, so we'll store pre-extracted text
const GUIDES = [
	{
		uri: "guide://guide1",
		name: "A Respectable Woman",
		description: "Kate Chopin short story - SuperSummary study guide",
		filePath: path.join(process.cwd(), "docs/guide1.pdf"),
	},
	{
		uri: "guide://guide2",
		name: "Teaching Critical Thinking",
		description: "bell hooks educational text - SuperSummary study guide",
		filePath: path.join(process.cwd(), "docs/guide2.pdf"),
	},
	{
		uri: "guide://guide3",
		name: "The Corrections",
		description: "Jonathan Franzen novel - SuperSummary study guide",
		filePath: path.join(process.cwd(), "docs/guide3.pdf"),
	},
];

// Cache for parsed guides (will be reused across function invocations)
let guidesCache: Map<string, string> | null = null;

/**
 * Initialize guides cache - reads and parses all PDFs
 * This should be called once when the serverless function starts
 */
async function initializeGuides(): Promise<Map<string, string>> {
	if (guidesCache) {
		return guidesCache;
	}

	guidesCache = new Map();

	// Try to use pdf-parse if available
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

/**
 * Read a guide by URI
 */
export async function readGuide(uri: string): Promise<string> {
	console.log(`[Serverless Reader] Reading guide: ${uri}`);
	const cache = await initializeGuides();
	const content = cache.get(uri);

	if (!content) {
		console.error(`[Serverless Reader] Guide not found: ${uri}`);
		throw new Error(`Guide not found: ${uri}`);
	}

	console.log(
		`[Serverless Reader] Successfully read guide: ${uri} (${content.length} characters)`,
	);
	return content;
}

/**
 * Search across all guides
 */
export async function searchGuides(query: string): Promise<string> {
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
			const end = Math.min(content.length, index + query.length + 100);
			const context = content.substring(start, end);

			results.push(`**${guide.name}**:\n...${context}...`);
		}
	}

	return results.length > 0
		? `Found "${query}" in the following guides:\n\n${results.join("\n\n")}`
		: `No results found for "${query}"`;
}

/**
 * Get guide summary
 */
export async function getGuideSummary(guideNumber: number): Promise<string> {
	const guide = GUIDES[guideNumber - 1];

	if (!guide) {
		throw new Error(`Invalid guide number: ${guideNumber}`);
	}

	const content = await readGuide(guide.uri);

	// Get first 500 characters as a summary
	const summary = content.substring(0, 500);

	return `**${guide.name} Summary**\n\n${summary}...`;
}

/**
 * List available guides
 */
export async function listGuides(): Promise<
	Array<{ uri: string; name: string; description: string }>
> {
	return GUIDES.map((g) => ({
		uri: g.uri,
		name: g.name,
		description: g.description,
	}));
}
