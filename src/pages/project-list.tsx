import { ActionPanel, Icon, List, OpenInBrowserAction, useNavigation } from "@raycast/api"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { Deployment, Project as ProjectType, Team } from "../types"
import { fetchDeploymentsForProject } from "../vercel"
import CopyToClipboardActionPanel from "./action-panels/copy-to-clipboard"
import DeploymentList from "./deployment-list"
import EnvironmentVariables from "./environment-variables-list"
import EditPreferences from "./forms/edit-preferences"

type Props = {
    project: ProjectType
    username?: string
    team?: Team
    updateProject: (projectId: string, project: Partial<ProjectType>, teamId?: string) => Promise<void>
}
const Project = ({ project, team, username, updateProject }: Props) => {
    const { push } = useNavigation()
    const [deployments, setDeployments] = useState<Deployment[]>()
    const [latestDeployment, setLatestDeployment] = useState<Deployment>()

    const name = team ? team.slug : username
    useEffect(() => {
        fetchDeploymentsForProject(project, team?.id).then((deployments) => {
            setDeployments(deployments)

            if (deployments.length)
                setLatestDeployment(deployments[0])
        })
    }, [])

    return (<List navigationTitle={project.name} isLoading={!deployments}>
        <List.Section title={"Navigation"}>
            <List.Item title={`Open in browser`}
                icon={Icon.ArrowRight}
                actions={
                    <ActionPanel>
                        <OpenInBrowserAction url={`https://vercel.com/${name}/${project.name}`} />
                    </ActionPanel>
                }
            />
            <List.Item title={`Open domains`} icon={Icon.ArrowRight}
                actions={
                    <ActionPanel>
                        <OpenInBrowserAction url={`https://vercel.com/${name}/${project.name}/settings/domains`} />
                    </ActionPanel>
                }
            />
            {project.analytics && <List.Item title={`Open analytics`} icon={Icon.ArrowRight}
                actions={
                    <ActionPanel>
                        <OpenInBrowserAction url={`https://vercel.com/${name}/${project.name}/analytics`} />
                    </ActionPanel>
                }
            />}
            <List.Item title={`Open logs`} icon={Icon.ArrowRight}
                actions={
                    <ActionPanel>
                        <OpenInBrowserAction url={`https://vercel.com/${project.accountId}/${project.name}/logs`} />
                    </ActionPanel>
                }
            />

        </List.Section>
        <List.Section title="Settings">
            <List.Item title={`Change project name`} icon={Icon.Gear}
                actions={
                    <ActionPanel>
                        <ActionPanel.Item
                            title="Edit"
                            onAction={() => push(<EditPreferences updateProject={updateProject} team={team} project={project} />)}
                        />
                    </ActionPanel>
                }
            />

            <List.Item title={`Environment Variables`} icon={Icon.List}
                subtitle={project.env?.length ? `${project.env.length} variables` : "No variables"}
                actions={
                    <ActionPanel>
                        <ActionPanel.Item
                            title="Edit"
                            onAction={() => push(<EnvironmentVariables team={team} project={project} />)}
                        />
                    </ActionPanel>
                }
            />
        </List.Section>
        <List.Section title={`Deployments`}>
            {latestDeployment && <List.Item title={`Visit most recent deployment`}
                icon={Icon.Link}
                subtitle={latestDeployment.createdAt ? dayjs(latestDeployment.createdAt).fromNow() : ''}
                accessoryTitle={latestDeployment.state?.toLowerCase() || latestDeployment.readyState?.toLowerCase()}
                actions={<ActionPanel>
                    <OpenInBrowserAction url={`https://${latestDeployment.url}`} />
                </ActionPanel>}
            />}
            {deployments && deployments.length ? <List.Item title="Search deployments..."
                icon={Icon.MagnifyingGlass}
                subtitle={`${deployments?.length} deployments loaded`}
                actions={
                    <ActionPanel>
                        <ActionPanel.Item
                            title="Search deployments..."
                            icon={{ source: Icon.MagnifyingGlass }}
                            onAction={() => {
                                push(<DeploymentList deployments={deployments} />)
                            }}
                        />
                    </ActionPanel>
                }
            /> : <List.Item title="No deployments" />}
        </List.Section>
        <List.Section title={`Project information`}>
            <List.Item icon={Icon.Clipboard} title={`Project ID`} subtitle={project.id} actions={<CopyToClipboardActionPanel text={project.id} />} />
        </List.Section>
    </List>
    )
}

export default Project