import { auth } from "@/app/(auth)/auth";
import {
	getActivePromptVersion,
	getPromptVersions,
	savePromptVersion,
	setActivePromptVersion,
} from "@/lib/db/queries/prompt-versions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const activeOnly = searchParams.get("active") === "true";

	try {
		if (activeOnly) {
			const activeVersion = await getActivePromptVersion(session.user.id);
			return NextResponse.json(activeVersion);
		}

		const versions = await getPromptVersions(session.user.id);
		return NextResponse.json(versions);
	} catch (error) {
		console.error("Error fetching prompt versions:", error);
		return NextResponse.json(
			{ error: "Failed to fetch prompt versions" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { version, prompt, notes, isActive } = await request.json();

		if (!version || !prompt) {
			return NextResponse.json(
				{ error: "Version and prompt are required" },
				{ status: 400 },
			);
		}

		const newVersion = await savePromptVersion(
			session.user.id,
			version,
			prompt,
			notes,
			isActive,
		);

		return NextResponse.json(newVersion, { status: 201 });
	} catch (error) {
		console.error("Error saving prompt version:", error);
		return NextResponse.json(
			{ error: "Failed to save prompt version" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id } = await request.json();

		if (!id) {
			return NextResponse.json(
				{ error: "Version ID is required" },
				{ status: 400 },
			);
		}

		await setActivePromptVersion(id, session.user.id);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error setting active version:", error);
		return NextResponse.json(
			{ error: "Failed to set active version" },
			{ status: 500 },
		);
	}
}
