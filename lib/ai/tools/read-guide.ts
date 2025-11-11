import { tool } from "ai";
import { z } from "zod";
import { readGuide } from "@/lib/mcp/client";
import { isDemoMode } from "@/lib/constants";
import { MOCK_GUIDES } from "@/lib/demo/mock-data";

export const readGuideTool = tool({
	description:
		"Read the full content of a SuperSummary study guide. Use this to access the complete guide content for lesson planning or analysis. Available guides: guide://guide1, guide://guide2, guide://guide3",
	inputSchema: z.object({
		uri: z
			.string()
			.describe(
				"The guide URI (e.g., guide://guide1, guide://guide2, or guide://guide3)",
			),
	}),
	execute: async ({ uri }) => {
		try {
			// Use mock data in demo mode
			if (isDemoMode) {
				const mockContent = MOCK_GUIDES[uri as keyof typeof MOCK_GUIDES];
				if (mockContent) {
					return mockContent;
				}
				return `Error: Guide ${uri} not found in demo mode`;
			}

			const content = await readGuide(uri);
			return content;
		} catch (error) {
			return `Error reading guide: ${error}`;
		}
	},
});
