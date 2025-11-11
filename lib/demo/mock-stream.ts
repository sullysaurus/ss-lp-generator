import { MOCK_LESSON_PLAN } from "./mock-data";

// Create a mock text stream that simulates AI responses
export async function* createMockTextStream(prompt: string) {
	// Simulate a slight delay before starting
	await new Promise((resolve) => setTimeout(resolve, 100));

	// Stream the mock lesson plan in chunks to simulate real AI behavior
	const chunkSize = 50; // Characters per chunk
	const delayBetweenChunks = 30; // ms between chunks

	for (let i = 0; i < MOCK_LESSON_PLAN.length; i += chunkSize) {
		yield MOCK_LESSON_PLAN.slice(i, i + chunkSize);
		// Add delay between chunks to make it feel like real streaming
		await new Promise((resolve) => setTimeout(resolve, delayBetweenChunks));
	}
}

// Mock response that looks like AI SDK streamText return value
export function createMockStreamResponse() {
	const mockUsage = {
		promptTokens: 1500,
		completionTokens: 2500,
		totalTokens: 4000,
	};

	return {
		text: MOCK_LESSON_PLAN,
		usage: mockUsage,
		finishReason: "stop" as const,
	};
}
