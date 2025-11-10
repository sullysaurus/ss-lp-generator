import { auth } from "@/app/(auth)/auth";
import { streamText } from "ai";
import { myProvider } from "@/lib/ai/providers";
import { readGuide } from "@/lib/mcp/client";
import { NextResponse } from "next/server";

const GUIDES = [
	{
		uri: "guide://guide1",
		name: "A Respectable Woman",
		number: 1,
	},
	{
		uri: "guide://guide2",
		name: "Teaching Critical Thinking",
		number: 2,
	},
	{
		uri: "guide://guide3",
		name: "The Corrections",
		number: 3,
	},
];

// Map form model values to actual model IDs
const MODEL_MAP: Record<string, string> = {
	grok: "chat-model",
	claude: "chat-model-claude",
	gemini: "chat-model-gemini",
};

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { prompt, model, temperature, maxTokens } = await request.json();

		if (!prompt || !model) {
			return NextResponse.json(
				{ error: "Prompt and model are required" },
				{ status: 400 },
			);
		}

		// Map the form model value to the actual model ID
		const actualModelId = MODEL_MAP[model] || model;

		const results = [];

		// Run the prompt against each guide
		for (const guide of GUIDES) {
			try {
				// Read the guide content
				const guideContent = await readGuide(guide.uri);

				// Create the full prompt with guide context
				const fullPrompt = `${prompt}\n\nGuide Content:\n${guideContent}`;

				// Stream the response
				const { textStream } = streamText({
					model: myProvider.languageModel(actualModelId as any),
					prompt: fullPrompt,
					temperature: temperature || 0.7,
				});

				// Collect the full response
				let fullResponse = "";
				for await (const chunk of textStream) {
					fullResponse += chunk;
				}

				results.push({
					guideName: guide.name,
					guideNumber: guide.number,
					output: fullResponse,
					success: true,
				});
			} catch (error: any) {
				console.error(`Error testing guide ${guide.number}:`, error);
				results.push({
					guideName: guide.name,
					guideNumber: guide.number,
					output: `Error: ${error.message}`,
					success: false,
				});
			}
		}

		return NextResponse.json({
			success: true,
			results,
		});
	} catch (error: any) {
		console.error("Error running prompt test:", error);
		return NextResponse.json(
			{ error: "Failed to run test", details: error.message },
			{ status: 500 },
		);
	}
}
