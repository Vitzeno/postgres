import { Client } from "pg";
import { DBCreds } from "./cred";

export async function listTables(props: DBCreds): Promise<string[]> {
  const client = new Client({
    user: props.username,
    host: props.host,
    database: props.database,
    password: props.password,
    port: parseInt(props.port),
  });

  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';");
    return res.rows.map((row) => row.table_name);
  } catch (error) {
    console.error("Error connecting to database", error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function listEntries(props: DBCreds, table: string, limit = 10): Promise<string[]> {
  const client = new Client({
    user: props.username,
    host: props.host,
    database: props.database,
    password: props.password,
    port: parseInt(props.port),
  });

  try {
    await client.connect();

    console.log(`\nListing entries for table: ${table}`);

    const entriesResult = await client.query(`SELECT * FROM ${table} LIMIT ${limit};`);
    const entries = entriesResult.rows;

    if (entries.length === 0) {
      console.log(`No entries found in table: ${table}`);
    } else {
      return entries;
    }

    return [];
  } catch (error) {
    console.error("Error connecting to database", error);
    throw error;
  } finally {
    await client.end();
  }
}
