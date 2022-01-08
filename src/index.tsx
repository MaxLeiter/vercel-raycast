import {
  render,
  List,
  preferences,
  showToast,
  ToastStyle,
  getLocalStorageItem,
} from '@raycast/api'
import { useEffect, useState } from 'react'
import useInterval from './use-interval'
import {
  fetchProjects,
  fetchTeams,
  fetchUser,
  updateProject,
} from './vercel'


import ProjectListSection from './pages/projects-list'
import TeamListSection from './pages/home/teams-list-section'
import { Project, Team, User } from './types'
import UserListSection from './pages/home/user-list-section'
import SelectedTeamSection from './pages/home/selected-team-section'

render(<Main />)

function Main(): JSX.Element {
  const token = String(preferences.token?.value)
  if (token.length !== 24) {
    showToast(ToastStyle.Failure, 'Invalid token detected')
    throw new Error('Invalid token length detected')
  }

  /* Establishing state:
  * user -- used for filtering deployments by user and displaying account information
  * selectedTeam - used for filtering deployments by team
  * teams -- used for filtering projects
  * projects -- used for listing projects. The projects are filtered by the user and selectedTeam
  */
  const [user, setUser] = useState<User>()
  const [teams, setTeams] = useState<Team[]>()
  const [selectedTeam, setSelectedTeam] = useState<Team>()
  const [projects, setProjects] = useState<Project[]>()

  /*
  * We store the selectedTeam ID in localStorage for persistence
  */
  useEffect(() => {
    async function getStoredId() {
      const storedTeamId = await getLocalStorageItem("team")
      if (storedTeamId) {
        const team = teams?.find(team => team.id === storedTeamId)
        setSelectedTeam(team)
      }
    }

    getStoredId()
  }, [teams, selectedTeam])

  /* 
  * Populate user, projects, and teams
  */
  useEffect(() => {
    const fetchData = async () => {
      const [fetchedUser, fetchedTeams] = await Promise.all([
        fetchUser(),
        fetchTeams()
      ])
      const fetchedProjects = await fetchProjects(fetchedUser.username, selectedTeam ? [selectedTeam] : undefined)
      setUser(fetchedUser)
      setProjects(fetchedProjects)
      setTeams(fetchedTeams)
    }
    fetchData()
  }, [])

  const updateProjects = async (user: User, selectedTeam?: Team) => {
    setProjects(await fetchProjects(user.username, selectedTeam ? [selectedTeam] : undefined))
  }

  /*
  * We refresh the projects every minute
  */
  useInterval(async () => {
    if (user) {
      updateProjects(user, selectedTeam)
    }
  }, 1000 * 60)


  // Update projects on team change
  useEffect(() => {
    if (user) {
      updateProjects(user, selectedTeam)
    }
  }, [selectedTeam])

  /*
  * Update the projects when a project is updated. Can be made more efficient.
  */
  const updateProjectWrapper = async (projectId: string, project: Partial<Project>, teamId?: string) => {
    const updated = await updateProject(projectId, project, teamId)
    if (updated && user)
      updateProjects(user, selectedTeam)
    else
      showToast(ToastStyle.Failure, 'Failed to update project')
  }

  return (
    <List isLoading={!projects || !teams || !user}>
      {/* {recentProjects && <RecentProjectListSection projectAndTeamIds={projectAndTeamIds} updateProject={updateProjectWrapper} teams={teams} />} */}
      {projects && <ProjectListSection username={user?.username} projects={projects} updateProject={updateProjectWrapper} selectedTeam={selectedTeam} />}
      {teams && <TeamListSection teams={teams} selectedTeam={selectedTeam} setTeam={setSelectedTeam} />}
      {user && !selectedTeam && <UserListSection user={user} />}
      {selectedTeam && <SelectedTeamSection team={selectedTeam} />}
    </List>)
}
