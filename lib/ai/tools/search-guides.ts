import { tool } from "ai";
import { z } from "zod";
import { searchGuides, getGuideSummary } from "@/lib/mcp/client";

export const searchGuidesTool = tool({
	description:
		"Search across all three SuperSummary study guides for specific content, themes, or keywords. Returns relevant excerpts with context.",
	inputSchema: z.object({
		query: z.string().describe("The search query or keyword to find in the guides"),
	}),
	execute: async ({ query }) => {
		try {
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
			const summary = await getGuideSummary(guide_number);
			return summary;
		} catch (error) {
			return `Error getting guide summary: ${error}`;
		}
	},
});
