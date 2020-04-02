

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { Card } from "azure-devops-ui/Card";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { showRootComponent } from "../../Common";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Animation } from './../images/Animation';
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import { BackendService } from '../Hub/BackendService';
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";
import { BuildList } from "./BuildList";
import { ReleaseList } from './ReleaseList';
import { TitleSize } from "azure-devops-ui/Header";

export interface IPipelineState {
    projectId?: string;
    builds?: any[];
    releases?: any[];
    loadingBuilds?: boolean;
    loadingReleases?: boolean;
}

class PipelineHubContent extends React.Component<{}, IPipelineState> {


    constructor(props: {}) {
        super(props);
        this.state = {
            loadingBuilds: true,
            loadingReleases: true
        };
    }


    public componentDidMount() {
        SDK.init();
        this.initialize();
    }


    private async loadData(projectId: string) {

        this.setState({
            loadingBuilds: true,
            loadingReleases: true
        });

        var builds = await new BackendService(projectId).getBuilds();
        this.setState({
            builds: builds,
            loadingBuilds: false
        });

        console.log(builds);

        var releases = await new BackendService(projectId).getReleases();
        this.setState({
            releases: releases,
            loadingReleases: false
        });

        console.log(releases);
    }

    private async initialize() {
        const projectService = await SDK.getService<IProjectPageService>
            (CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        if (project) {

            this.setState({
                projectId: project.id
            });
            this.loadData(project.id);
        }
    }

    public render(): JSX.Element {


        return (
            <Page className="sample-hub flex-grow">
                <Header title={"Pipelines in Purpose (P0002)"} />

                <div className="page-content page-content-top flex-column rhythm-vertical-16">



                    <Card titleProps={{
                            text: "Builds",
                            size: TitleSize.Medium
                        }}>
                            <BuildList builds={this.state.builds} />                                                
                    </Card>

                    <Card titleProps={{
                            text: "Releases",
                            size: TitleSize.Medium
                        }}>
                            <ReleaseList releases={this.state.releases} />                                                
                    </Card>                    


                </div>
            </Page>
        );
    }
}


showRootComponent(<PipelineHubContent />);