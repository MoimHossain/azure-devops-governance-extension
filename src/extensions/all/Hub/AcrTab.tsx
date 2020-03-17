

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";
import { BackendService } from './BackendService';
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

import { Card } from "azure-devops-ui/Card";
import { ScrollableList, IListItemDetails, ListSelection, ListItem } from "azure-devops-ui/List";
import { Animation } from './../images/Animation';
import { Images } from './../images/Images';

const AcrIcon = (new Images()).getAcrIcon();

export interface IAcrTabState {
    loading: boolean;
    projectName?: string;
    projectId?: string;
    repos?: any;
}

interface IAcrItem {
    name?: string;
    id?: string;
    url?: string;
}

export class AcrTab extends React.Component<{}, IAcrTabState> {
    private selection = new ListSelection(true);

    constructor(props: {}) {
        super(props);
        this.state = { loading: true };
    }

    public componentDidMount() {
        this.initialize();
    }

    public render(): JSX.Element {
        const { repos, loading } = this.state;
        const mv = new ArrayItemProvider<IAcrItem>(repos);
        return (
            <div className="page-content page-content-top flex-column rhythm-vertical-16">
                <Card>
                    {
                        loading &&
                        <Animation />
                    }
                    {
                        (!loading && repos) &&
                        <div style={{ display: "flex", height: "300px" }}>
                            <ScrollableList
                                itemProvider={mv}
                                renderRow={this.renderRow}
                                selection={this.selection}
                                width="100%"
                            />
                        </div>

                    }
                </Card>
            </div>
        );
    }


    private renderRow = (
        index: number,
        item: IAcrItem,
        details: IListItemDetails<IAcrItem>,
        key?: string
    ): JSX.Element => {
        return (
            <ListItem key={key || "list-item" + index} index={index} details={details}>
                <div className="list-example-row flex-row h-scroll-hidden">
                    <img alt="" className="contributed-icon contributed-icon-image bolt-image flex-noshrink"
                        style={{ width: 24, height: 24, marginTop: 12 }}
                        src={AcrIcon} />
                    <div
                        style={{ marginLeft: "10px", padding: "10px 0px" }}
                        className="flex-column h-scroll-hidden"
                    >
                        <span className="text-ellipsis">{item.name}</span>
                        <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
                            The {item.name} in Azure
                        </span>
                    </div>
                </div>
            </ListItem>
        );
    };

    private async initialize() {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        if (project) {
            var repos = await new BackendService(project.id).getAcrs();
            this.setState({
                projectName: project.name,
                projectId: project.id,
                repos: repos,
                loading: false
            });
        }
    }
}