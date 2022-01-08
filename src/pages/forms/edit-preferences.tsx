import { ActionPanel, Form, FormValues, showToast, SubmitFormAction, ToastStyle, useNavigation } from "@raycast/api"
import { Project, Team } from "../../types"

type Props = {
    project: Project
    team?: Team
    updateProject: (projectId: string, project: Partial<Project>, teamId?: string) => Promise<void>
}

const EditPreferences = ({ project, team, updateProject }: Props) => {
    const { pop } = useNavigation()

    function handleSubmit(values: FormValues) {
        updateProject(project.id, values, team?.id).then(() => {
            showToast(ToastStyle.Success, "Name updated")
            pop()
        })
    }

    return (
        <Form actions={
            <ActionPanel>
                <SubmitFormAction title="Submit" onSubmit={handleSubmit} />
            </ActionPanel>
        }
            navigationTitle={`Edit ${project.name} preferences`}
        >
            <Form.TextField id="name" defaultValue={project.name} title="Project name" />
        </Form>
    )
}

export default EditPreferences