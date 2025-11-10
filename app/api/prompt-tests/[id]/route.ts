import { auth } from "@/app/(auth)/auth";
import {
  deletePromptTest,
  getPromptTestById,
  updatePromptTest,
} from "@/lib/db/queries/prompt-tests";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const test = await getPromptTestById(id);

    if (!test) {
      return NextResponse.json(
        { error: "Prompt test not found" },
        { status: 404 }
      );
    }

    if (test.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error fetching prompt test:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt test" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const test = await getPromptTestById(id);

    if (!test) {
      return NextResponse.json(
        { error: "Prompt test not found" },
        { status: 404 }
      );
    }

    if (test.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updated = await updatePromptTest(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating prompt test:", error);
    return NextResponse.json(
      { error: "Failed to update prompt test" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const test = await getPromptTestById(id);

    if (!test) {
      return NextResponse.json(
        { error: "Prompt test not found" },
        { status: 404 }
      );
    }

    if (test.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deletePromptTest(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prompt test:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt test" },
      { status: 500 }
    );
  }
}
