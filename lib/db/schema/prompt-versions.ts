import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const promptVersions = pgTable("PromptVersions", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("userId")
		.notNull()
		.references(() => import("./user").users.id),
	version: text("version").notNull(), // e.g., "v1", "v2", "final"
	prompt: text("prompt").notNull(),
	notes: text("notes"), // What changed in this version
	metadata: jsonb("metadata"), // Additional data like model used, temperature, etc.
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type PromptVersion = typeof promptVersions.$inferSelect;
export type NewPromptVersion = typeof promptVersions.$inferInsert;
