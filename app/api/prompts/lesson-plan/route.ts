import { auth } from "@/app/(auth)/auth";
import { lessonPlanPrompt } from "@/lib/ai/prompts";
import { getActivePromptVersion } from "@/lib/db/queries/prompt-versions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Check for active custom version first
	const activeVersion = await getActivePromptVersion(session.user.id);

	return NextResponse.json({
		prompt: activeVersion?.prompt || lessonPlanPrompt,
		isCustom: !!activeVersion,
		versionId: activeVersion?.id,
		versionName: activeVersion?.version,
	});
}
