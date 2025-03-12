import "dotenv/config";
import { Client } from "pg";
import { getDatabaseConfig } from "./config";

class Database {
  private static instancePromise: Promise<Client> | null = null;
  private static instance: Client | null = null;
  private constructor() {}

  static async createInstance(): Promise<Client> {
    try {
      const { url, ssl } = await getDatabaseConfig();

      const client = new Client({
        connectionString: url,
        ssl,
      });

      await client.connect();
      console.log("Database connected");

      client.on("error", (error) => {
        this.instancePromise = null;
        this.instance = null;
        console.error("Database error >", error);
      });

      this.instance = client;
    } catch (error) {
      console.error("Database error >", error);
      throw error;
    } finally {
      this.instancePromise = null;
    }

    return this.instance;
  }

  static async getInstance(): Promise<Client> {
    if (this.instance) {
      return this.instance;
    }
    if (!this.instancePromise) {
      this.instancePromise = this.createInstance();
    }
    return await this.instancePromise;
  }

  static async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const client = await this.getInstance();
    const result = await client.query(sql, params);
    return result.rows;
  }
}

export default Database;
