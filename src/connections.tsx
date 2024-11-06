import { useEffect, useState } from "react";
import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { getAllDBCreds } from "./storage/storage";
import { DBCreds } from "./db/cred";
import TablesView from "./tables";

export default function Command() {
  const { push } = useNavigation();
  const [credsMap, setCredsMap] = useState<{ id: string; cred: DBCreds }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDBCreds()
      .then((cred) => {
        setCredsMap(cred);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error retreiving credentials", error);
      });
  }, []);

  return (
    <List isShowingDetail>
      {credsMap.map((credsMap) => (
        <List.Item
          actions={
            <ActionPanel>
              <Action
                title="Query"
                onAction={() => {
                  push(<TablesView creds={credsMap.cred} />);
                }}
              />
            </ActionPanel>
          }
          key={credsMap.id}
          title={credsMap.cred.database}
          subtitle={credsMap.id}
          detail={
            <List.Item.Detail
              isLoading={loading}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="ID" text={credsMap.id} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Database" text={credsMap.cred.database} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Username" text={credsMap.cred.username} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Host" text={credsMap.cred.host} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Port" text={credsMap.cred.port} />
                </List.Item.Detail.Metadata>
              }
              markdown={`
              TODO: User provided description here
              `}
            />
          }
        />
      ))}
    </List>
  );
}
