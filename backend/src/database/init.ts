import "dotenv/config";
import { Client } from "pg";
import { getDatabaseConfig } from "./config";

let db: Client | null = null;

async function initializeDatabase() {
  if (!db) {
    const { url, ssl } = await getDatabaseConfig();

    try {
      db = new Client({
        connectionString: url,
        ssl,
      });
      console.log("DATABASE IS SET UP");
    } catch (error) {
      db = null;
      console.error("ERROR INITIALIZING DATABASE ->", error);
      throw error;
    }
  }
  return db;
}

async function getDatabase(): Promise<Client> {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}

export { getDatabase };
