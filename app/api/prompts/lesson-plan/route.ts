import { auth } from "@/app/(auth)/auth";
import { lessonPlanPrompt } from "@/lib/ai/prompts";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.json({
		prompt: lessonPlanPrompt,
	});
}
