import { useState } from "react";
import { Action, ActionPanel, Alert, confirmAlert, Form, showToast, Toast } from "@raycast/api";
import { DBCreds } from "./db/cred";
import { FormValidation, useForm } from "@raycast/utils";
import { queryTable } from "./db/query";

// TODO: Set action style to Destructive => Alert.ActionStyle.Destructive;
const options: Alert.Options = {
  title: "Run Query",
  message: "Query can be dangerous, are you sure you want to run it?",
  primaryAction: {
    title: "Run",
  },
  dismissAction: {
    title: "Cancel",
  },
  rememberUserChoice: true,
};

interface TableQueryViewProps {
  creds: DBCreds;
}

interface TableQueryForm {
  query: string;
}

export default function TableQueryView({ creds }: TableQueryViewProps) {
  const [formError, setFormError] = useState<string>();

  const { handleSubmit, itemProps } = useForm<TableQueryForm>({
    onSubmit(values) {
      (async () => {
        if (await confirmAlert(options)) {
          console.log("The alert action has been triggered");
          queryTable(creds, values.query)
            .then((result) => {
              console.log(result); // TODO: Display results in a new view
              showToast({
                style: Toast.Style.Success,
                title: "Yay!",
                message: `Database query successful!`,
              });
            })
            .catch((error) => {
              console.error("Error querying table", error);
              showToast({
                style: Toast.Style.Failure,
                title: "Oops!",
                message: `Database query failed!`,
              });

              setFormError(`Query failed: ${error}`);
            });
        } else {
          console.log("The alert has been dismissed");
        }
      })();
    },
    validation: {
      query: FormValidation.Required,
    },
  });

  return (
    <Form
      navigationTitle="Custom Query"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Run Query" onSubmit={handleSubmit} />
        </ActionPanel>
      }
      {...itemProps}
    >
      <Form.TextArea error={formError} id="query" title="Query" placeholder="SQL Query" />
    </Form>
  );
}
