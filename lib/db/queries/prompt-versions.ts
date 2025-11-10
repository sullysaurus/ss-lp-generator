import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { promptVersion, type PromptVersion } from "../schema";

export async function savePromptVersion(
	userId: string,
	version: string,
	prompt: string,
	notes?: string,
): Promise<PromptVersion> {
	const [newVersion] = await db
		.insert(promptVersion)
		.values({
			userId,
			version,
			prompt,
			notes,
		})
		.returning();

	return newVersion;
}

export async function getPromptVersions(
	userId: string,
): Promise<PromptVersion[]> {
	return await db
		.select()
		.from(promptVersion)
		.where(eq(promptVersion.userId, userId))
		.orderBy(desc(promptVersion.createdAt));
}

export async function getPromptVersionById(
	id: string,
	userId: string,
): Promise<PromptVersion | null> {
	const [version] = await db
		.select()
		.from(promptVersion)
		.where(eq(promptVersion.id, id))
		.where(eq(promptVersion.userId, userId));

	return version || null;
}

export async function deletePromptVersion(
	id: string,
	userId: string,
): Promise<void> {
	await db
		.delete(promptVersion)
		.where(eq(promptVersion.id, id))
		.where(eq(promptVersion.userId, userId));
}
