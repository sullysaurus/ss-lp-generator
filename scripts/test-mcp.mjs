#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMCP() {
  const serverPath = path.join(__dirname, '../mcp-server/dist/index.js');

  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath],
  });

  const client = new Client(
    {
      name: 'mcp-tester',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log('✅ MCP client connected successfully\n');

    // Test 1: List resources
    console.log('Test 1: Listing available resources...');
    const resources = await client.listResources();
    console.log(`Found ${resources.resources?.length || 0} resources:`);
    resources.resources?.forEach((r) => {
      console.log(`  - ${r.name}: ${r.uri}`);
    });
    console.log();

    // Test 2: Read a guide resource
    console.log('Test 2: Reading guide://guide1...');
    const guideContent = await client.readResource({ uri: 'guide://guide1' });
    if (guideContent.contents && guideContent.contents.length > 0) {
      const content = guideContent.contents[0];
      if ('text' in content) {
        const preview = content.text.substring(0, 200);
        console.log(`✅ Successfully read guide content (${content.text.length} chars)`);
        console.log(`Preview: ${preview}...`);
      }
    }
    console.log();

    // Test 3: Search guides
    console.log('Test 3: Searching for "identity"...');
    const searchResult = await client.callTool({
      name: 'search_guides',
      arguments: { query: 'identity' },
    });
    if (searchResult.content && searchResult.content.length > 0) {
      const content = searchResult.content[0];
      if ('text' in content) {
        console.log(`✅ Search completed`);
        console.log(`Results: ${content.text.substring(0, 300)}...`);
      }
    }
    console.log();

    // Test 4: Get guide summary
    console.log('Test 4: Getting summary for guide 2...');
    const summaryResult = await client.callTool({
      name: 'get_guide_summary',
      arguments: { guide_number: 2 },
    });
    if (summaryResult.content && summaryResult.content.length > 0) {
      const content = summaryResult.content[0];
      if ('text' in content) {
        console.log(`✅ Summary retrieved`);
        console.log(content.text.substring(0, 300));
      }
    }
    console.log();

    console.log('✅ All MCP tests passed successfully!');
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ MCP test failed:', error);
    process.exit(1);
  }
}

testMCP();
