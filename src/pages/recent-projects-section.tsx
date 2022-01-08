import { ActionPanel, getLocalStorageItem, Icon, List, setLocalStorageItem, useNavigation } from "@raycast/api"
import ProjectComponent from "./project-list"

import type { Project, Team } from "../types"
import { useEffect, useState } from "react"
import { fetchProjectById } from "../vercel"

type Props = {
    projectAndTeamIds: {
        projectId: string
        teamId?: string
    }[]
    username?: string
    teams?: Team[]
    updateProject: (projectId: string, project: Partial<Project>, teamId?: string) => Promise<void>
}

const RecentProjectListSection = ({ projectAndTeamIds, teams, username, updateProject }: Props) => {
    const { push } = useNavigation()
    const [projects, setProjects] = useState<Project[]>()
    useEffect(() => {
        if (projectAndTeamIds?.length) {
            const idsWithoutDupes = [...new Set(projectAndTeamIds)]
            const updateProjects = async () => {
                await Promise.all(idsWithoutDupes.map(async ({ projectId, teamId }) => fetchProjectById(projectId, teamId))).then((projects) => {
                    setProjects(projects.filter((project) => project))
                })
            }
            updateProjects()
        }
    }, [projectAndTeamIds])

    return (
        <List navigationTitle="Results" isLoading={!projects}>
            {projects && projects.map((project) => {
                const teamForProject = teams?.find(team => team.id === project.accountId)

                return (<List.Item key={project.id} title={project.name || "No name"} actions={
                    <ActionPanel>
                        <ActionPanel.Item
                            title="Open"
                            icon={Icon.ArrowRight}
                            onAction={async () => {
                                const previous = await getLocalStorageItem<string>("recents")
                                const recents = previous ? JSON.parse(previous) : []
                                await setLocalStorageItem("recents", JSON.stringify(recents?.length ? [project.id, ...recents] : [project.id]))
                                push(<ProjectComponent username={username} team={teamForProject} project={project} updateProject={updateProject} />)
                            }}
                        />
                    </ActionPanel>
                } />)
            }
            )
            }
        </List>
    )
}

export default RecentProjectListSection