import { LocalStorage } from "@raycast/api";
import { randomUUID } from "crypto";
import { DBCreds } from "../db/cred";

export async function saveDBCreds(creds: DBCreds): Promise<string> {
  const id = randomUUID(); // Generate a unique ID for the credentials
  await LocalStorage.setItem(id, JSON.stringify(creds));
  return id;
}

export async function getDBCreds(id: string): Promise<DBCreds | null> {
  const credsString = await LocalStorage.getItem<string>(id);
  if (!credsString) {
    return null;
  }
  return JSON.parse(credsString);
}

export async function getAllDBCreds(): Promise<{ id: string; cred: DBCreds }[]> {
  const allItems = await LocalStorage.allItems();
  const dbCreds: { id: string; cred: DBCreds }[] = [];

  for (const [key, value] of Object.entries(allItems)) {
    try {
      const cred: DBCreds = JSON.parse(value);
      dbCreds.push({ id: key, cred });
    } catch (error) {
      console.error(`Failed to parse credentials for key ${key}`, error);
    }
  }

  return dbCreds;
}

export async function deleteDBCreds(id: string): Promise<void> {
  await LocalStorage.removeItem(id);
}

export async function updateDBCreds(id: string, updatedCreds: DBCreds): Promise<void> {
  await LocalStorage.setItem(id, JSON.stringify(updatedCreds));
}
