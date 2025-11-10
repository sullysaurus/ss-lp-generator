#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define the guide resources
// __dirname will be mcp-server/dist/, so we need to go up two levels to get to project root
const GUIDES = [
    {
        uri: 'guide://guide1',
        name: 'A Respectable Woman',
        description: 'Kate Chopin short story - SuperSummary study guide',
        mimeType: 'application/pdf',
        filePath: path.join(__dirname, '../../docs/guide1.pdf'),
    },
    {
        uri: 'guide://guide2',
        name: 'Teaching Critical Thinking',
        description: 'bell hooks educational text - SuperSummary study guide',
        mimeType: 'application/pdf',
        filePath: path.join(__dirname, '../../docs/guide2.pdf'),
    },
    {
        uri: 'guide://guide3',
        name: 'The Corrections',
        description: 'Jonathan Franzen novel - SuperSummary study guide',
        mimeType: 'application/pdf',
        filePath: path.join(__dirname, '../../docs/guide3.pdf'),
    },
];
// Create server instance
const server = new Server({
    name: 'supersummary-guides',
    version: '1.0.0',
}, {
    capabilities: {
        resources: {},
        tools: {},
    },
});
// List available resources (the three guides)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: GUIDES.map((guide) => ({
            uri: guide.uri,
            name: guide.name,
            description: guide.description,
            mimeType: guide.mimeType,
        })),
    };
});
// Read a specific guide resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const guide = GUIDES.find((g) => g.uri === request.params.uri);
    if (!guide) {
        throw new Error(`Guide not found: ${request.params.uri}`);
    }
    try {
        // Read the PDF file
        const dataBuffer = await fs.readFile(guide.filePath);
        // Parse the PDF to extract text
        const pdfData = await pdfParse(dataBuffer);
        return {
            contents: [
                {
                    uri: guide.uri,
                    mimeType: 'text/plain',
                    text: `# ${guide.name}\n\n${pdfData.text}`,
                },
            ],
        };
    }
    catch (error) {
        throw new Error(`Failed to read guide: ${error}`);
    }
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'search_guides',
                description: 'Search across all three guides for specific content',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'The search query to find in the guides',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'get_guide_summary',
                description: 'Get a summary of a specific guide',
                inputSchema: {
                    type: 'object',
                    properties: {
                        guide_number: {
                            type: 'number',
                            description: 'The guide number (1, 2, or 3)',
                            enum: [1, 2, 3],
                        },
                    },
                    required: ['guide_number'],
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === 'search_guides') {
        const query = args?.query?.toLowerCase() || '';
        const results = [];
        for (const guide of GUIDES) {
            try {
                const dataBuffer = await fs.readFile(guide.filePath);
                const pdfData = await pdfParse(dataBuffer);
                const text = pdfData.text.toLowerCase();
                if (text.includes(query)) {
                    // Find context around the match
                    const index = text.indexOf(query);
                    const start = Math.max(0, index - 100);
                    const end = Math.min(text.length, index + query.length + 100);
                    const context = pdfData.text.substring(start, end);
                    results.push(`**${guide.name}**:\n...${context}...`);
                }
            }
            catch (error) {
                console.error(`Error searching ${guide.name}:`, error);
            }
        }
        return {
            content: [
                {
                    type: 'text',
                    text: results.length > 0
                        ? `Found "${args?.query || ''}" in the following guides:\n\n${results.join('\n\n')}`
                        : `No results found for "${args?.query || ''}"`,
                },
            ],
        };
    }
    if (name === 'get_guide_summary') {
        const guideNumber = args?.guide_number;
        const guide = GUIDES[guideNumber - 1];
        if (!guide) {
            throw new Error(`Invalid guide number: ${guideNumber}`);
        }
        try {
            const dataBuffer = await fs.readFile(guide.filePath);
            const pdfData = await pdfParse(dataBuffer);
            // Get first 500 characters as a summary
            const summary = pdfData.text.substring(0, 500);
            return {
                content: [
                    {
                        type: 'text',
                        text: `**${guide.name} Summary**\n\nPages: ${pdfData.numpages}\n\n${summary}...`,
                    },
                ],
            };
        }
        catch (error) {
            throw new Error(`Failed to get summary: ${error}`);
        }
    }
    throw new Error(`Unknown tool: ${name}`);
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('SuperSummary Guides MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map