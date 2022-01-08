import { ActionPanel, Form, FormValues, Icon, SubmitFormAction } from "@raycast/api"
import type { Environment } from "../../types"

type Props = {
    createEnvVar: (envVar: Partial<Environment>) => Promise<void>
}
const NewEnvironmentVariable = ({ createEnvVar }: Props) => {
    const onSubmit = (values: FormValues) => {
        const targets = () => {
            const target = []
            if (values['edit-form-development']) target.push('development')
            if (values['edit-form-preview']) target.push('preview')
            if (values['edit-form-production']) target.push('production')
            return target
        }
        const formedValues: Partial<Environment> = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            target: targets() as any,
            type: values.dropdown,
            key: values.key,
            value: values.value,
        }
        createEnvVar(formedValues)
    }

    return (<Form actions={
        <ActionPanel>
            <SubmitFormAction title="Submit" onSubmit={onSubmit} />
        </ActionPanel>}
    >
        <Form.Dropdown id={"dropdown"} title="Type">
            <Form.DropdownItem
                title="Provided by System"
                value="system"
                icon={Icon.Desktop}
            />
            <Form.DropdownItem
                title="Plaintext"
                value="plain"
                icon={Icon.TextDocument}
            />
            <Form.DropdownItem
                title="Secret"
                value="secret"
                icon={Icon.EyeSlash}
            />
        </Form.Dropdown>
        <Form.Separator />
        <Form.TextField id="key" title="Environment variable key" />
        <Form.TextField id="value" title="Environment variable value" />
        <Form.Separator />
        <Form.Checkbox id="edit-form-production" label="Production" />
        <Form.Checkbox id="edit-form-preview" label="Preview" />
        <Form.Checkbox id="edit-form-development" label="Development" />

    </Form >)
}

export default NewEnvironmentVariable