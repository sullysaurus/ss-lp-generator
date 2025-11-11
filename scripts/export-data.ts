import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { promptVersion, promptTest } from "../lib/db/schema";
import { writeFileSync } from "fs";
import { join } from "path";

// Load .env.local file
dotenv.config({ path: ".env.local" });

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

async function exportData() {
  console.log("📤 Exporting data from database...\n");

  // Export prompt versions
  const versions = await db.select().from(promptVersion);
  console.log(`✅ Found ${versions.length} prompt versions`);

  // Export prompt tests
  const tests = await db.select().from(promptTest);
  console.log(`✅ Found ${tests.length} prompt tests`);

  // Prepare export data
  const exportData = {
    promptVersions: versions.map((v) => ({
      version: v.version,
      prompt: v.prompt,
      notes: v.notes,
      isActive: v.isActive,
      metadata: v.metadata,
      createdAt: v.createdAt.toISOString(),
    })),
    promptTests: tests.map((t) => ({
      title: t.title,
      prompt: t.prompt,
      model: t.model,
      settings: t.settings,
      guide1Output: t.guide1Output,
      guide2Output: t.guide2Output,
      guide3Output: t.guide3Output,
      commentary: t.commentary,
      iteration: t.iteration,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
    exportedAt: new Date().toISOString(),
  };

  // Write to file
  const outputPath = join(process.cwd(), "scripts", "seed-data.json");
  writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

  console.log(`\n✨ Data exported to: ${outputPath}`);
  console.log(
    `\n📋 Summary:\n   - ${versions.length} prompt versions\n   - ${tests.length} prompt tests`
  );

  await client.end();
}

exportData().catch((error) => {
  console.error("Error exporting data:", error);
  process.exit(1);
});
