import "dotenv/config";
import { Client } from "pg";
import { getDatabaseConfig } from "./config";

class Database {
  private static instance: Client | null = null;
  private static isConnecting = false;

  private constructor() {}

  static async getInstance(): Promise<Client> {
    if (this.instance !== null) {
      return this.instance;
    }

    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (this.instance !== null) {
            clearInterval(checkConnection);
            resolve(this.instance);
          }
        }, 100);
      });
    }

    this.isConnecting = true;

    try {
      const { url, ssl } = await getDatabaseConfig();
      console.log("creds =>", url, ssl);

      this.instance = new Client({
        connectionString: url,
        ssl,
      });

      await this.instance.connect();
      console.log("Database connected =>");

      this.instance.on("error", (error) => {
        console.error("Database connection error =>", error);
        this.instance = null;
        this.isConnecting = false;
      });

      return this.instance;
    } catch (error) {
      this.instance = null;
      console.error("Database init error =>", error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  static async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const client = await this.getInstance();
    const result = await client.query(sql, params);
    return result.rows;
  }
}

export default Database;
