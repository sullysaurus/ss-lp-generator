import { tool } from "ai";
import { z } from "zod";
import { searchGuides, getGuideSummary } from "@/lib/mcp/client";
import { isDemoMode } from "@/lib/constants";
import { MOCK_GUIDES } from "@/lib/demo/mock-data";

export const searchGuidesTool = tool({
	description:
		"Search across all three SuperSummary study guides for specific content, themes, or keywords. Returns relevant excerpts with context.",
	inputSchema: z.object({
		query: z.string().describe("The search query or keyword to find in the guides"),
	}),
	execute: async ({ query }) => {
		try {
			// Use mock search in demo mode
			if (isDemoMode) {
				const results: string[] = [];
				const searchQuery = query.toLowerCase();

				for (const [uri, content] of Object.entries(MOCK_GUIDES)) {
					const lowerContent = content.toLowerCase();
					if (lowerContent.includes(searchQuery)) {
						const index = lowerContent.indexOf(searchQuery);
						const start = Math.max(0, index - 100);
						const end = Math.min(content.length, index + query.length + 100);
						const context = content.substring(start, end);
						const guideName = uri.replace("guide://guide", "Guide ");
						results.push(`**${guideName}**:\n...${context}...`);
					}
				}

				return results.length > 0
					? `Found "${query}" in the following guides:\n\n${results.join("\n\n")}`
					: `No results found for "${query}"`;
			}

			const results = await searchGuides(query);
			return results;
		} catch (error) {
			return `Error searching guides: ${error}`;
		}
	},
});

export const getGuideSummaryTool = tool({
	description:
		"Get a summary and overview of a specific SuperSummary guide, including page count and preview.",
	inputSchema: z.object({
		guide_number: z
			.number()
			.min(1)
			.max(3)
			.describe("The guide number: 1, 2, or 3"),
	}),
	execute: async ({ guide_number }) => {
		try {
			// Use mock summary in demo mode
			if (isDemoMode) {
				const uri = `guide://guide${guide_number}`;
				const content = MOCK_GUIDES[uri as keyof typeof MOCK_GUIDES];
				if (content) {
					const summary = content.substring(0, 500);
					return `**Guide ${guide_number} Summary**\n\n${summary}...`;
				}
				return `Guide ${guide_number} not found in demo mode`;
			}

			const summary = await getGuideSummary(guide_number);
			return summary;
		} catch (error) {
			return `Error getting guide summary: ${error}`;
		}
	},
});
