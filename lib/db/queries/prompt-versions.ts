import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { promptVersion, type PromptVersion } from "../schema";

export async function savePromptVersion(
	userId: string,
	version: string,
	prompt: string,
	notes?: string,
	isActive?: boolean,
): Promise<PromptVersion> {
	// If this is being set as active, deactivate all other versions first
	if (isActive) {
		await db
			.update(promptVersion)
			.set({ isActive: false })
			.where(eq(promptVersion.userId, userId));
	}

	const [newVersion] = await db
		.insert(promptVersion)
		.values({
			userId,
			version,
			prompt,
			notes,
			isActive: isActive || false,
		})
		.returning();

	return newVersion;
}

export async function getActivePromptVersion(
	userId: string,
): Promise<PromptVersion | null> {
	const [version] = await db
		.select()
		.from(promptVersion)
		.where(eq(promptVersion.userId, userId))
		.where(eq(promptVersion.isActive, true));

	return version || null;
}

export async function setActivePromptVersion(
	id: string,
	userId: string,
): Promise<void> {
	// Deactivate all versions first
	await db
		.update(promptVersion)
		.set({ isActive: false })
		.where(eq(promptVersion.userId, userId));

	// Activate the specified version
	await db
		.update(promptVersion)
		.set({ isActive: true })
		.where(eq(promptVersion.id, id))
		.where(eq(promptVersion.userId, userId));
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
