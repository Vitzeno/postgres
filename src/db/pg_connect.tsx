import { Client } from "pg";
import { DBCreds } from "./cred";

export async function testConnection(props: DBCreds): Promise<boolean> {
  const client = new Client({
    user: props.username,
    host: props.host,
    database: props.database,
    password: props.password,
    port: parseInt(props.port),
  });

  try {
    await client.connect();
    return true;
  } catch (error) {
    console.error("Error connecting to database", error);
    return false;
  } finally {
    await client.end();
  }
}
