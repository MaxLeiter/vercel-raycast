import { Icon, List } from "@raycast/api"
import dayjs from "dayjs"
import { Team } from "../../types"
import CopyToClipboardActionPanel from "../action-panels/copy-to-clipboard"

type Props = {
    team: Team
}

const SelectedTeamSection = ({ team }: Props) => {

    const { description, createdAt, id, membership, name, resourceConfig } = team

    const ListItem = ({ title, subtitle }: { title: string, subtitle: string }) => {
        return (
            <List.Item title={title} subtitle={subtitle} icon={Icon.Clipboard}
                actions={<CopyToClipboardActionPanel text={subtitle} /> } />
        )
    }

    return (
        <List.Section title={`Team information`}>
            {description && <ListItem title="Description" subtitle={description} />}
            <ListItem title="Name" subtitle={name} />
            <ListItem title="ID" subtitle={id} />
            <ListItem title="Created" subtitle={dayjs(createdAt).fromNow()} />
            {membership && <ListItem title="Your role" subtitle={membership.role} />}
            {resourceConfig && <ListItem title="Concurrent builds " subtitle={resourceConfig.concurrentBuilds.toString()} />}
        </List.Section>
    )
}

export default SelectedTeamSection
