import { auth } from "@/app/(auth)/auth";
import { getPromptTestsByUserId } from "@/lib/db/queries/prompt-tests";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// Get all tests for the user
		const tests = await getPromptTestsByUserId(session.user.id);

		if (tests.length === 0) {
			return NextResponse.json(
				{ error: "No tests found" },
				{ status: 404 },
			);
		}

		// Generate CSV content
		const headers = [
			"Title",
			"Iteration",
			"Model",
			"Temperature",
			"Max Tokens",
			"AI Prompt",
			"Guide 1 Output (A Respectable Woman)",
			"Guide 2 Output (Teaching Critical Thinking)",
			"Guide 3 Output (The Corrections)",
			"Commentary",
			"Created At",
		];

		const rows = tests.map((test) => [
			test.title,
			test.iteration || "",
			test.model,
			test.settings?.temperature || "",
			test.settings?.maxTokens || "",
			`"${(test.prompt || "").replace(/"/g, '""')}"`,
			`"${(test.guide1Output || "").replace(/"/g, '""')}"`,
			`"${(test.guide2Output || "").replace(/"/g, '""')}"`,
			`"${(test.guide3Output || "").replace(/"/g, '""')}"`,
			`"${(test.commentary || "").replace(/"/g, '""')}"`,
			new Date(test.createdAt).toISOString(),
		]);

		// Create CSV content
		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.join(",")),
		].join("\n");

		// Return CSV file
		return new NextResponse(csvContent, {
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition":
					'attachment; filename="prompt-tests-export.csv"',
			},
		});
	} catch (error) {
		console.error("Error exporting prompt tests:", error);
		return NextResponse.json(
			{ error: "Failed to export tests" },
			{ status: 500 },
		);
	}
}
