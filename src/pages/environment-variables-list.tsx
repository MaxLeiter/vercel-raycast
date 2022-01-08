import { ActionPanel, confirmAlert, Icon, List, showToast, ToastStyle, useNavigation } from "@raycast/api"
import { useEffect, useState } from "react";
import { Environment, Project, Team } from "../types";
import { createEnvironmentVariable, deleteEnvironmentVariableById, fetchEnvironmentVariables, updateEnvironmentVariable } from "../vercel";
import EditEnvironmentVariable from "./forms/edit-env-var";
import NewEnvironmentVariable from "./forms/new-env-var";

type Props = {
    project: Project
    team?: Team
}

const EnvironmentVariables = ({ project, team }: Props) => {
    const [vars, setVars] = useState<Environment[]>()
    const { push, pop } = useNavigation()

    useEffect((): void => {
        async function fetchVars() {
            setVars(await fetchEnvironmentVariables(project.id, team?.id))
        }

        fetchVars()
    }, [])

    const updateEnvVar = async (id: string, envVar: Partial<Environment>) => {
        const updatedEnvVariable = await updateEnvironmentVariable(project.id, id, envVar)
        if (updatedEnvVariable.key) {
            showToast(ToastStyle.Success, "Environment variable updated")
            pop()
            setVars(await fetchEnvironmentVariables(project.id, team?.id))
        } else {
            showToast(ToastStyle.Failure, "Failed to update environment variable")
        }
    }


    const createEnvVar = async (envVar: Partial<Environment>) => {
        const addedVar = await createEnvironmentVariable(project.id, envVar, team?.id)
        if (addedVar) {
            setVars(await fetchEnvironmentVariables(project.id, team?.id))
            showToast(ToastStyle.Success, "Environment variable created")
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "system":
                return Icon.Desktop
            case "secret":
                return Icon.EyeSlash
            case "encrypted":
                return Icon.TextDocument
            case "plain":
                return Icon.TextDocument
            default:
                return Icon.TextDocument
        }
    }

    return (
        <List navigationTitle={`Environment variables for ${project.name}`} isLoading={!vars}>
            <List.Item
                title="New environment variable"
                icon={Icon.Plus}
                actions={
                    <ActionPanel>
                        <ActionPanel.Item
                            title="Add"
                            onAction={() => {
                                push(<NewEnvironmentVariable createEnvVar={createEnvVar} />)
                            }
                            }
                        />
                    </ActionPanel>
                }
            />
            {vars?.map((v) => (
                <List.Item
                    key={v.id}
                    title={v.key}
                    subtitle={v.type === "secret" ? "" : v.value}
                    icon={getIcon(v.type)}
                    actions={
                        <ActionPanel>
                            <ActionPanel.Item
                                title="Edit"
                                icon={Icon.Pencil}
                                onAction={() => push(<EditEnvironmentVariable envVar={v} updateEnvVar={updateEnvVar} />)}
                            />
                            <ActionPanel.Item
                                title="Delete"
                                onAction={async () => {
                                    if (await confirmAlert({ title: `Are you sure you want to delete ${v.key}}?` })) {
                                        await deleteEnvironmentVariableById(project.id, v.id)
                                    }
                                }}
                                icon={Icon.Trash}
                            />
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    )
}

export default EnvironmentVariables
