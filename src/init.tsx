import { Action, ActionPanel, Form, LaunchProps, showToast, Toast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { testConnection } from "./db/pg_connect";
import { saveDBCreds } from "./storage/storage";
import { DBCreds } from "./db/cred";

// TODO: Find way to have secondary action to test connection, rather than before submitting
export default function Command(props: LaunchProps<{ draftValues: DBCreds }>) {
  const { draftValues } = props;

  const { handleSubmit, itemProps } = useForm<DBCreds>({
    onSubmit(values) {
      testConnection(values).then((result) => {
        if (!result) {
          showToast({
            style: Toast.Style.Failure,
            title: "Oops!",
            message: `Database connection failed!`,
          });
          return false;
        }

        showToast({
          style: Toast.Style.Success,
          title: "Yay!",
          message: `Database connection successful!`,
        });
      });

      const id = saveDBCreds({
        database: values.database,
        username: values.username,
        password: values.password,
        host: values.host,
        port: values.port,
      });
      console.log("Saved DB credentials with ID:", id);
    },
    validation: {
      database: FormValidation.Required,
      username: FormValidation.Required,
      password: FormValidation.Required,
      host: FormValidation.Required,
      port: FormValidation.Required,
    },
  });

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
          {/* <Action.SubmitForm title="Test Connection" onSubmit={handleSubmit} /> */}
        </ActionPanel>
      }
      {...itemProps}
    >
      <Form.TextField
        title="Database name"
        placeholder="Database"
        defaultValue={draftValues?.database}
        {...itemProps.database}
      />
      <Form.TextField
        title="Username"
        placeholder="Username"
        defaultValue={draftValues?.username}
        {...itemProps.username}
      />
      <Form.PasswordField title="Password" placeholder="Password" {...itemProps.password} />
      <Form.TextField title="Host" placeholder="Localhost" defaultValue={draftValues?.host} {...itemProps.host} />
      <Form.TextField title="Port" placeholder="5432" defaultValue={draftValues?.port} {...itemProps.port} />
    </Form>
  );
}
