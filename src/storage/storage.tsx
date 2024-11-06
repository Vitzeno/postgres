import { LocalStorage } from "@raycast/api";
import { randomUUID } from "crypto";
import { DBCreds } from "../db/cred";

// export async function addDatabaseCredentials(creds: DBCreds): Promise<void> {
//   const id = randomUUID();
//   try {
//     await LocalStorage.setItem(`database-${id}`, creds.database);
//     await LocalStorage.setItem(`username-${id}`, creds.username);
//     await LocalStorage.setItem(`password-${id}`, creds.password);
//     await LocalStorage.setItem(`host-${id}`, creds.host);
//     await LocalStorage.setItem(`port-${id}`, creds.port);

//     console.log("Database credentials set");
//   } catch (error) {
//     console.error("Error setting database credentials", error);
//     throw error;
//   }
// }

// export async function getAllKeys(): Promise<string[]> {
//   const keys = await LocalStorage.allItems<DBCreds>();
//   return Object.keys(keys);
// }

// export async function getAllItems(): Promise<DBCreds[]> {
//   const items = await LocalStorage.allItems<DBCreds[]>();
//   return items;
// }

// export async function clearAll(): Promise<void> {
//   await LocalStorage.clear();
// }

// Function to save database credentials
export async function saveDBCreds(creds: DBCreds): Promise<string> {
  const id = randomUUID(); // Generate a unique ID for the credentials
  await LocalStorage.setItem(id, JSON.stringify(creds));
  return id;
}

// Function to get database credentials by ID
export async function getDBCreds(id: string): Promise<DBCreds | null> {
  const credsString = await LocalStorage.getItem<string>(id);
  if (!credsString) {
    return null;
  }
  return JSON.parse(credsString);
}

// Function to get all saved credentials
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

// Function to delete credentials by ID
export async function deleteDBCreds(id: string): Promise<void> {
  await LocalStorage.removeItem(id);
}

// Function to update credentials by ID
export async function updateDBCreds(id: string, updatedCreds: DBCreds): Promise<void> {
  await LocalStorage.setItem(id, JSON.stringify(updatedCreds));
}
