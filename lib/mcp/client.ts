import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import path from "path";

// Import serverless-compatible guide reader
import * as GuideReader from "../guides/reader";

let mcpClient: Client | null = null;
let clientPromise: Promise<Client> | null = null;

// Detect if we're in a serverless environment (Vercel)
const isServerless =
	process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME != null;

/**
 * Get or create MCP client connection (only works locally)
 */
async function getMCPClientLocal(): Promise<Client> {
	if (mcpClient) {
		return mcpClient;
	}

	if (clientPromise) {
		return clientPromise;
	}

	clientPromise = (async () => {
		const serverPath = path.join(process.cwd(), "mcp-server/dist/index.js");

		const transport = new StdioClientTransport({
			command: "node",
			args: [serverPath],
		});

		const client = new Client(
			{
				name: "supersummary-chat-client",
				version: "1.0.0",
			},
			{
				capabilities: {},
			},
		);

		await client.connect(transport);
		mcpClient = client;

		return client;
	})();

	return clientPromise;
}

/**
 * Read a guide resource
 * Uses serverless reader in production, MCP client locally
 */
export async function readGuide(uri: string): Promise<string> {
	if (isServerless) {
		return GuideReader.readGuide(uri);
	}

	const client = await getMCPClientLocal();
	const response = await client.readResource({ uri });

	if (response.contents && response.contents.length > 0) {
		const content = response.contents[0];
		if ("text" in content && typeof content.text === "string") {
			return content.text;
		}
	}

	throw new Error(`Could not read guide: ${uri}`);
}

/**
 * Search across all guides
 * Uses serverless reader in production, MCP client locally
 */
export async function searchGuides(query: string): Promise<string> {
	if (isServerless) {
		return GuideReader.searchGuides(query);
	}

	const client = await getMCPClientLocal();
	const result = await client.callTool({
		name: "search_guides",
		arguments: { query },
	});

	if (Array.isArray(result.content) && result.content.length > 0) {
		const content = result.content[0];
		if ("text" in content && typeof content.text === "string") {
			return content.text;
		}
	}

	return "No results found";
}

/**
 * Get guide summary
 * Uses serverless reader in production, MCP client locally
 */
export async function getGuideSummary(guide_number: number): Promise<string> {
	if (isServerless) {
		return GuideReader.getGuideSummary(guide_number);
	}

	const client = await getMCPClientLocal();
	const result = await client.callTool({
		name: "get_guide_summary",
		arguments: { guide_number },
	});

	if (Array.isArray(result.content) && result.content.length > 0) {
		const content = result.content[0];
		if ("text" in content && typeof content.text === "string") {
			return content.text;
		}
	}

	return "Could not get summary";
}

/**
 * List available guide resources
 * Uses serverless reader in production, MCP client locally
 */
export async function listGuides(): Promise<
	Array<{ uri: string; name: string; description: string }>
> {
	if (isServerless) {
		return GuideReader.listGuides();
	}

	const client = await getMCPClientLocal();
	const response = await client.listResources();

	return (
		response.resources?.map((r) => ({
			uri: r.uri,
			name: r.name || "Unknown",
			description: r.description || "",
		})) || []
	);
}

/**
 * Close the MCP client connection (only used locally)
 */
export async function closeMCPClient(): Promise<void> {
	if (mcpClient) {
		await mcpClient.close();
		mcpClient = null;
		clientPromise = null;
	}
}
