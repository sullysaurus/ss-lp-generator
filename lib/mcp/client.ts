import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "child_process";
import path from "path";

let mcpClient: Client | null = null;
let clientPromise: Promise<Client> | null = null;

/**
 * Get or create MCP client connection
 */
export async function getMCPClient(): Promise<Client> {
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
 */
export async function readGuide(uri: string): Promise<string> {
	const client = await getMCPClient();

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
 */
export async function searchGuides(query: string): Promise<string> {
	const client = await getMCPClient();

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
 */
export async function getGuideSummary(guide_number: number): Promise<string> {
	const client = await getMCPClient();

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
 */
export async function listGuides(): Promise<
	Array<{ uri: string; name: string; description: string }>
> {
	const client = await getMCPClient();

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
 * Close the MCP client connection
 */
export async function closeMCPClient(): Promise<void> {
	if (mcpClient) {
		await mcpClient.close();
		mcpClient = null;
		clientPromise = null;
	}
}
