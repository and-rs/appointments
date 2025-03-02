import fs from "node:fs";
import path from "node:path";
import Database from "../src/database/init";

async function runMigrations() {
  try {
    const migrationsPath = path.join(__dirname, "../migrations/sql");
    const files = fs
      .readdirSync(migrationsPath)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsPath, file), "utf8");
      await Database.query(sql);
      console.log(`Ran migration: ${file}`);
    }
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
}

export const handler = async () => {
  try {
    await runMigrations();

    const db = await Database.getInstance();
    await db.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Migrations completed successfully" }),
    };
  } catch (error) {
    console.error("Migration handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Migration failed" }),
    };
  }
};

handler();
