import { useEffect, useState } from "react";
import { List, showToast, Toast } from "@raycast/api";
import { DBCreds } from "./db/cred";
import { listEntries, listTables } from "./db/query";
import { jsonToMarkdownTable } from "./utils/json";

interface TableViewProps {
  creds: DBCreds;
}

export default function TablesView({ creds }: TableViewProps) {
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    listTables(creds)
      .then((tables) => {
        setTables(tables);
        showToast({
          style: Toast.Style.Success,
          title: "Yay!",
          message: `Database connection successful!`,
        });
      })
      .catch((error) => {
        console.error("Error listing tables", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Oops!",
          message: `Database connection failed!`,
        });
      });
  }, [creds]);

  return (
    <List isShowingDetail>
      {tables.map((table) => (
        <List.Item title={table} key={table} detail={<EntryView creds={creds} table={table} />} />
      ))}
    </List>
  );
}

interface EntryViewProps {
  creds: DBCreds;
  table: string;
}

function EntryView({ creds, table }: EntryViewProps) {
  const [entries, setEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listEntries(creds, table)
      .then((entries) => {
        setEntries(entries);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error listing entries", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Oops!",
          message: `Database connection failed!`,
        });
      });
  }, [creds, table]);

  return <List.Item.Detail isLoading={loading} markdown={`${jsonToMarkdownTable(entries)}`} />;
}
