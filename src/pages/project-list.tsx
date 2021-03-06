import { ActionPanel, Icon, List, useNavigation, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { fromNow } from "../time";
import { Deployment, Project as ProjectType, Team } from "../types";
import { fetchDeploymentsForProject } from "../vercel";
import CopyToClipboardActionPanel from "./action-panels/copy-to-clipboard";
import DeploymentList from "./deployments-list";
import EnvironmentVariables from "./environment-variables-list";
import EditPreferences from "./forms/edit-preferences";

type Props = {
  project: ProjectType;
  username?: string;
  team?: Team;
  updateProject: (projectId: string, project: Partial<ProjectType>, teamId?: string) => Promise<void>;
};
const Project = ({ project, team, username, updateProject }: Props) => {
  const { push } = useNavigation();
  const [deployments, setDeployments] = useState<Deployment[]>();
  const [latestDeployment, setLatestDeployment] = useState<Deployment>();
  const name = team ? team.slug : username;
  useEffect(() => {
    fetchDeploymentsForProject(project, team?.id).then((deployments) => {
      setDeployments(deployments);

      if (deployments.length) setLatestDeployment(deployments[0]);
    });
  }, []);

  return (
    <List navigationTitle={project.name} isLoading={!deployments}>
      <List.Section title={"Navigation"}>
        <List.Item
          title={`Open in Browser`}
          icon={Icon.ArrowRight}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={`https://vercel.com/${name}/${project.name}`} />
            </ActionPanel>
          }
        />
        <List.Item
          title={`Open Domains`}
          icon={Icon.ArrowRight}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={`https://vercel.com/${name}/${project.name}/settings/domains`} />
            </ActionPanel>
          }
        />
        {project.analytics && (
          <List.Item
            title={`Open Analytics`}
            icon={Icon.ArrowRight}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={`https://vercel.com/${name}/${project.name}/analytics`} />
              </ActionPanel>
            }
          />
        )}
        <List.Item
          title={`Open Logs`}
          icon={Icon.ArrowRight}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={`https://vercel.com/${project.accountId}/${project.name}/logs`} />
            </ActionPanel>
          }
        />
      </List.Section>
      <List.Section title="Settings">
        <List.Item
          title={`Change project name`}
          icon={Icon.Gear}
          actions={
            <ActionPanel>
              <Action
                title="Edit"
                onAction={() => push(<EditPreferences updateProject={updateProject} team={team} project={project} />)}
              />
            </ActionPanel>
          }
        />

        <List.Item
          title={`Environment Variables`}
          icon={Icon.List}
          subtitle={project.env?.length ? `${project.env.length} variables` : "No Variables"}
          actions={
            <ActionPanel>
              <Action title="Edit" onAction={() => push(<EnvironmentVariables team={team} project={project} />)} />
            </ActionPanel>
          }
        />
      </List.Section>
      <List.Section title={`Deployments`}>
        {latestDeployment && (
          <List.Item
            title={`Visit Most Recent Deployment`}
            icon={Icon.Link}
            subtitle={latestDeployment.createdAt ? fromNow(latestDeployment.createdAt) : ""}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={`https://${latestDeployment.url}`} />
              </ActionPanel>
            }
            accessories={[
              {
                text: latestDeployment.state?.toLowerCase() || latestDeployment.readyState?.toLowerCase(),
              },
            ]}
          />
        )}
        {deployments && deployments.length ? (
          <List.Item
            title="Search Deployments..."
            icon={Icon.MagnifyingGlass}
            subtitle={`${deployments?.length} deployments loaded`}
            actions={
              <ActionPanel>
                <Action
                  title="Search Deployments..."
                  icon={{ source: Icon.MagnifyingGlass }}
                  onAction={() => {
                    push(<DeploymentList deployments={deployments} />);
                  }}
                />
              </ActionPanel>
            }
          />
        ) : (
          <List.Item title="No Deployments" />
        )}
      </List.Section>
      <List.Section title={`Project Information`}>
        <List.Item
          icon={Icon.Clipboard}
          title={`Project ID`}
          subtitle={project.id}
          id={project.id}
          actions={<CopyToClipboardActionPanel text={project.id} />}
        />
      </List.Section>
    </List>
  );
};

export default Project;
