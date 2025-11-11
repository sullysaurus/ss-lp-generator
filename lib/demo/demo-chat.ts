import { MOCK_LESSON_PLAN } from "./mock-data";

// Simple demo mode chat handler that returns mock responses
export async function createDemoResponse() {
	// Simulate reading the guide tool call
	const toolCallDelay = 500; // Half second
	await new Promise((resolve) => setTimeout(resolve, toolCallDelay));

	// Return a simple JSON response that mimics the AI SDK format
	return {
		role: "assistant",
		content: MOCK_LESSON_PLAN,
		toolCalls: [
			{
				toolName: "readGuide",
				args: { uri: "guide://guide1" },
				result: "Successfully read guide content...",
			},
		],
	};
}

// Create a mock SSE stream for demo mode
export function createDemoStream(content: string) {
	const encoder = new TextEncoder();
	let index = 0;
	const chunkSize = 50;

	const stream = new ReadableStream({
		async start(controller) {
			// Send initial message start
			controller.enqueue(
				encoder.encode(`0:{"type":"text-delta","textDelta":""}\n`),
			);

			// Stream content in chunks
			while (index < content.length) {
				const chunk = content.slice(index, index + chunkSize);
				const escaped = JSON.stringify(chunk).slice(1, -1); // Remove quotes
				controller.enqueue(
					encoder.encode(`0:{"type":"text-delta","textDelta":"${escaped}"}\n`),
				);

				index += chunkSize;
				// Add delay between chunks to simulate streaming
				await new Promise((resolve) => setTimeout(resolve, 30));
			}

			// Send finish message
			controller.enqueue(
				encoder.encode(
					`0:{"type":"finish","finishReason":"stop","usage":{"promptTokens":1500,"completionTokens":2500,"totalTokens":4000}}\n`,
				),
			);

			controller.close();
		},
	});

	return stream;
}
