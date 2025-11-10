import { auth } from "@/app/(auth)/auth";
import {
  createPromptTest,
  getPromptTestsByUserId,
} from "@/lib/db/queries/prompt-tests";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tests = await getPromptTestsByUserId(session.user.id);
    return NextResponse.json(tests);
  } catch (error) {
    console.error("Error fetching prompt tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt tests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const test = await createPromptTest({
      userId: session.user.id,
      title: body.title,
      prompt: body.prompt,
      model: body.model,
      settings: body.settings,
      guide1Output: body.guide1Output,
      guide2Output: body.guide2Output,
      guide3Output: body.guide3Output,
      commentary: body.commentary,
      iteration: body.iteration,
    });
    return NextResponse.json(test);
  } catch (error) {
    console.error("Error creating prompt test:", error);
    return NextResponse.json(
      { error: "Failed to create prompt test" },
      { status: 500 }
    );
  }
}
