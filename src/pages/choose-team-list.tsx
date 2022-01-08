import { Icon, Color, List, ActionPanel, setLocalStorageItem } from "@raycast/api"
import {  useState, useEffect } from "react"
import { Team } from "../types"

type Props = {
    teams?: Team[]
    setTeam: (team?: Team) => void
    selectedTeam?: Team
}

const ChooseTeamList = ({ teams: defaultTeams, setTeam, selectedTeam: defaultSelectedTeam }: Props) => {
    const [teams, setTeams] = useState<Team[] | undefined>(defaultTeams)
    const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(defaultSelectedTeam?.id)

    useEffect(() => {
        if (selectedTeamId) {
            const team = teams?.find(team => team.id === selectedTeamId)
            if (team) setTeam(team)
        } else {
            setTeam(undefined)
        }
    }, [selectedTeamId])

    useEffect(() => {
        setTeams(defaultTeams)
    }, [defaultTeams])

    const SelfIcon = selectedTeamId ? { source: Icon.Person } : { source: Icon.Checkmark, tintColor: Color.Green }
    const Self = <List.Item title='Personal' key={'personal'} icon={SelfIcon} actions={<ActionPanel><ActionPanel.Item
        title="Switch Team"
        icon={SelfIcon}
        onAction={() => {
            setLocalStorageItem("team", "")
            setSelectedTeamId(undefined)
        }}
    /></ActionPanel>} />
    const TeamList = [Self, teams?.map((team) => {
        const icon = selectedTeamId && team.id === selectedTeamId ? { source: Icon.Checkmark, tintColor: Color.Green } : { source: Icon.Globe }
        return <List.Item
            title={team.name}
            key={team.slug}
            icon={icon}
            actions={<ActionPanel><ActionPanel.Item
                title="Switch Team"
                icon={icon}
                onAction={() => {
                    setLocalStorageItem("team", team.id)
                    setSelectedTeamId(team.id)
                }}
            /></ActionPanel>}
        />
    })];

    return (<List isLoading={!teams}>
        {TeamList.map((item) => item)}
    </List>)
}

export default ChooseTeamList