#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function identifyGuides() {
  const serverPath = path.join(__dirname, '../mcp-server/dist/index.js');

  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath],
  });

  const client = new Client(
    {
      name: 'guide-identifier',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log('Connected to MCP server\n');

    // Get summaries for all three guides
    for (let i = 1; i <= 3; i++) {
      console.log(`${'='.repeat(60)}`);
      console.log(`GUIDE ${i}`);
      console.log(`${'='.repeat(60)}`);

      try {
        const result = await client.callTool({
          name: 'get_guide_summary',
          arguments: { guide_number: i },
        });

        if (result.content && result.content.length > 0) {
          const content = result.content[0];
          if ('text' in content) {
            console.log(content.text);
          }
        }
        console.log('\n');
      } catch (error) {
        console.error(`Error getting guide ${i} summary:`, error.message);
      }
    }

    await client.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

identifyGuides();
