import { ActionPanel, getLocalStorageItem, Icon, List, OpenInBrowserAction, setLocalStorageItem, useNavigation } from "@raycast/api"
import ProjectComponent from "./project-list"

import { Project, Team } from "../types"
import dayjs from "dayjs"

type Props = {
    projects?: Project[]
    username?: string
    selectedTeam?: Team
    updateProject: (projectId: string, project: Partial<Project>, teamId?: string) => Promise<void>
}

const ProjectList = ({ projects, username, selectedTeam: team, updateProject }: Props) => {

    const { push } = useNavigation()
    return (
        <List navigationTitle="Results" isLoading={!projects}>
            {projects && projects.map((project) => <List.Item key={project.id} title={project.name}
                subtitle={project.framework ?? ''}
                keywords={[project.framework || '']}
                accessoryTitle={project.latestDeployments?.length && project.latestDeployments[0].createdAt ? dayjs(project.latestDeployments[0].createdAt).fromNow() : ''}
                actions={
                    <ActionPanel>
                        <ActionPanel.Item
                            title="Open"
                            icon={Icon.ArrowRight}
                            onAction={async () => {
                                const previous = await getLocalStorageItem<string>("recents")
                                const recents = previous ? JSON.parse(previous) : []
                                await setLocalStorageItem("recents", JSON.stringify(recents?.length ? [...recents, project.id] : [project.id]))
                                push(<ProjectComponent username={username} team={team} project={project} updateProject={updateProject} />)
                            }}
                        />
                    </ActionPanel>
                } />)}
        </List>
    )
}

const ProjectListSection = ({ projects, selectedTeam, username, updateProject }: Props) => {
    const { push } = useNavigation()

    const newURL = `https://vercel.com/new${selectedTeam ? `/${selectedTeam.slug}` : ""}`
    return (
        <List.Section title={selectedTeam ? `${selectedTeam.name}: Projects` : `Projects`}>
            <List.Item title={selectedTeam ? `${selectedTeam.name}: Search projects...` : `Search projects...`} icon={Icon.MagnifyingGlass}
                actions={
                    <ActionPanel>
                        <ActionPanel.Item
                            title="Search Projects..."
                            icon={{ source: Icon.MagnifyingGlass }}
                            onAction={() => push(<ProjectList projects={projects} updateProject={updateProject} username={username} selectedTeam={selectedTeam} />)}
                        />
                    </ActionPanel>
                }
            />
            <List.Item title='Create New Project' icon={Icon.Plus}
                actions={
                    <ActionPanel>
                        <OpenInBrowserAction url={newURL} />
                    </ActionPanel>}
            />
        </List.Section>
    )
}

export default ProjectListSection