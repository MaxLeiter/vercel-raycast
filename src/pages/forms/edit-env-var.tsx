import { ActionPanel, Form, Icon, Action } from "@raycast/api";
import type { Environment } from "../../types";

type Props = {
  envVar: Environment;
  updateEnvVar: (id: string, envVar: Partial<Environment>) => Promise<void>;
};
const EditEnvironmentVariable = ({ updateEnvVar, envVar }: Props) => {
  const onSubmit = (values: Form.Values) => {
    const targets = () => {
      const target = [];
      if (values["edit-form-development"]) target.push("development");
      if (values["edit-form-preview"]) target.push("preview");
      if (values["edit-form-production"]) target.push("production");
      return target;
    };
    const formedValues: Partial<Environment> = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target: targets() as any,
      type: values.dropdown,
      key: values.key,
      value: values.value,
    };

    updateEnvVar(envVar.id, formedValues);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={onSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id={"dropdown"} defaultValue={envVar.type} title="Type">
        <Form.Dropdown.Item title="Provided by System" value="system" icon={Icon.Desktop} />
        <Form.Dropdown.Item title="Plaintext" value="plain" icon={Icon.TextDocument} />
        <Form.Dropdown.Item title="Secret" value="secret" icon={Icon.EyeSlash} />
      </Form.Dropdown>
      <Form.Separator />
      <Form.TextField id="key" defaultValue={envVar.key} title="Environment variable key" />
      <Form.TextField id="value" defaultValue={envVar.value} title="Environment variable value" />
      <Form.Separator />
      <Form.Checkbox
        id="edit-form-production"
        label="Production"
        defaultValue={envVar.target?.includes("production")}
      />
      <Form.Checkbox id="edit-form-preview" label="Preview" defaultValue={envVar.target?.includes("preview")} />
      <Form.Checkbox
        id="edit-form-development"
        label="Development"
        defaultValue={envVar.target?.includes("development")}
      />
    </Form>
  );
};

export default EditEnvironmentVariable;
