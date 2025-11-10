import { auth } from "@/app/(auth)/auth";
import {
  deletePromptVersion,
  getPromptVersionById,
} from "@/lib/db/queries/prompt-versions";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { promptVersion } from "@/lib/db/schema";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const { notes } = await request.json();

  try {
    // Verify the version belongs to this user
    const existingVersion = await getPromptVersionById(id, session.user.id);

    if (!existingVersion) {
      return Response.json("Version not found", { status: 404 });
    }

    // Update the version notes
    const [updated] = await db
      .update(promptVersion)
      .set({ notes })
      .where(
        and(eq(promptVersion.id, id), eq(promptVersion.userId, session.user.id))
      )
      .returning();

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating prompt version:", error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  try {
    await deletePromptVersion(id, session.user.id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting prompt version:", error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}
