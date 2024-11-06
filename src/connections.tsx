import { useEffect, useState } from "react";
import { List } from "@raycast/api";
import { getAllDBCreds } from "./storage/storage";
import { DBCreds } from "./db/cred";

export default function Command() {
  const [credsMap, setCredsMap] = useState<{ id: string; cred: DBCreds }[]>([]);

  useEffect(() => {
    getAllDBCreds().then((cred) => {
      setCredsMap(cred);
    });
  }, []);

  return (
    <List isShowingDetail>
      {credsMap.map((credsMap) => (
        <List.Item
          key={credsMap.id}
          title={credsMap.cred.database}
          subtitle={credsMap.id}
          detail={
            <List.Item.Detail
              markdown={`
              ID: ${credsMap.id}\n
              Database: ${credsMap.cred.database}\n
              Username: ${credsMap.cred.username}\n
              Password: ${credsMap.cred.password}\n
              Host: ${credsMap.cred.host}\n
              Port: ${credsMap.cred.port}\n
              `}
            />
          }
        />
      ))}
    </List>
  );
}
