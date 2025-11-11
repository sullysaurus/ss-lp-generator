import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { promptVersion, promptTest, user } from "../lib/db/schema";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local file
dotenv.config({ path: ".env.local" });

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

async function importData() {
  console.log("📥 Importing data to database...\n");

  // Read the export file
  const dataPath = join(process.cwd(), "scripts", "seed-data.json");
  const rawData = readFileSync(dataPath, "utf-8");
  const data = JSON.parse(rawData);

  console.log(`📋 Found in export file:`);
  console.log(`   - ${data.promptVersions.length} prompt versions`);
  console.log(`   - ${data.promptTests.length} prompt tests`);

  // Get the first user from the database (or create a guest user)
  const users = await db.select().from(user).limit(1);

  if (users.length === 0) {
    console.error(
      "\n❌ No users found in database. Please create a user first."
    );
    process.exit(1);
  }

  const userId = users[0].id;
  console.log(`\n✅ Using user: ${users[0].email} (${userId})`);

  // Import prompt versions
  console.log("\n📝 Importing prompt versions...");
  for (const version of data.promptVersions) {
    await db.insert(promptVersion).values({
      userId,
      version: version.version,
      prompt: version.prompt,
      notes: version.notes,
      isActive: version.isActive,
      metadata: version.metadata,
      createdAt: new Date(version.createdAt),
    });
    console.log(`   ✓ ${version.version}`);
  }

  // Import prompt tests
  console.log("\n🧪 Importing prompt tests...");
  for (const test of data.promptTests) {
    await db.insert(promptTest).values({
      userId,
      title: test.title,
      prompt: test.prompt,
      model: test.model,
      settings: test.settings,
      guide1Output: test.guide1Output,
      guide2Output: test.guide2Output,
      guide3Output: test.guide3Output,
      commentary: test.commentary,
      iteration: test.iteration,
      createdAt: new Date(test.createdAt),
      updatedAt: new Date(test.updatedAt),
    });
    console.log(`   ✓ ${test.title}`);
  }

  console.log("\n✨ Import completed successfully!");

  await client.end();
}

importData().catch((error) => {
  console.error("Error importing data:", error);
  process.exit(1);
});
