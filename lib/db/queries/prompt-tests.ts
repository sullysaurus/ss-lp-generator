import "server-only";

import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { promptTest, type PromptTest } from "../schema";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getPromptTestsByUserId(userId: string) {
  try {
    return await db
      .select()
      .from(promptTest)
      .where(eq(promptTest.userId, userId))
      .orderBy(desc(promptTest.updatedAt));
  } catch (error) {
    console.error("Failed to get prompt tests by user id", error);
    return [];
  }
}

export async function getPromptTestById(id: string) {
  try {
    const result = await db
      .select()
      .from(promptTest)
      .where(eq(promptTest.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Failed to get prompt test by id", error);
    return null;
  }
}

export async function createPromptTest(data: {
  userId: string;
  title: string;
  prompt: string;
  model: string;
  settings?: any;
  guide1Output?: string;
  guide2Output?: string;
  guide3Output?: string;
  commentary?: string;
  iteration?: string;
}) {
  try {
    const result = await db
      .insert(promptTest)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to create prompt test", error);
    throw error;
  }
}

export async function updatePromptTest(
  id: string,
  data: Partial<Omit<PromptTest, "id" | "userId" | "createdAt">>
) {
  try {
    const result = await db
      .update(promptTest)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(promptTest.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update prompt test", error);
    throw error;
  }
}

export async function deletePromptTest(id: string) {
  try {
    await db.delete(promptTest).where(eq(promptTest.id, id));
  } catch (error) {
    console.error("Failed to delete prompt test", error);
    throw error;
  }
}
