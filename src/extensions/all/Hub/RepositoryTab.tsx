

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";
import { BackendService } from './BackendService';
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Panel } from "azure-devops-ui/Panel";
import { Card } from "azure-devops-ui/Card";
import { ScrollableList, IListItemDetails, ListSelection, ListItem } from "azure-devops-ui/List";
import { Animation } from './../images/Animation';

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";

const simpleObservable = new ObservableValue<string>("");
export interface IRepositoryTabState {
    loading: boolean;
    projectName?: string;
    projectId?: string;
    repos?: any;
    repoPanelIsBusy: boolean;
    repoPromptValid: boolean;
}

export interface IRepositoryTabProperties {
    repoExpanded: boolean;
    onCollapse(): any
}

interface IRepositoryItem {
    name?: string;
    id?: string;
    url?: string;
}

export class RepositoryTab extends React.Component<IRepositoryTabProperties, IRepositoryTabState> {
    private selection = new ListSelection(true);

    constructor(props: IRepositoryTabProperties) {
        super(props);
        this.state = { loading: true, repoPromptValid: false, repoPanelIsBusy: false };
    }

    public componentDidMount() {
        this.initialize();
    }

    private async createRepositoryAsync() {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();    
        if(project) {
            this.setState({repoPanelIsBusy: true});
            await new BackendService(project.id)
                .createRepoAsync(project.id, simpleObservable.value);
            this.setState({repoPanelIsBusy: false});
            this.props.onCollapse();
        }
    }

    private getButtons() {
        const items = [];
        items.push({ text: "Cancel", onClick: () => this.props.onCollapse() });
        if(!this.state.repoPanelIsBusy && this.state.repoPromptValid) {
            items.push({ text: "Create", primary: true, onClick: () => this.createRepositoryAsync() });
        }
        return items;
    }

    public render(): JSX.Element {
        const { repos, loading } = this.state;
        const mv = new ArrayItemProvider<IRepositoryItem>(repos);
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
                    
                    {
                        this.props.repoExpanded && 
                        <Panel
                            onDismiss={() => this.props.onCollapse()}
                            titleProps={{ text: "New Repository" }}
                            description={
                                "Please fill out the information below."
                            }
                            footerButtonProps={this.getButtons()}>
                            <div>
                            
                                <TextField
                                        value={simpleObservable}
                                        readOnly={false}
                                        spellCheck={false}     
                                        required={true}                                   
                                        onChange={(e, newValue) => {
                                            simpleObservable.value = newValue
                                            if(newValue.length > 0) {
                                                this.setState({ repoPromptValid: true })
                                            }
                                        }}
                                        placeholder="Enter Repository Name"
                                        width={TextFieldWidth.standard}
                                    />
                                    {
                                        this.state.repoPanelIsBusy && <p><Animation /></p>
                                    }
                            </div>
                        </Panel>
                    }
                </Card>
            </div>
        );
    }


    private renderRow = (
        index: number,
        item: IRepositoryItem,
        details: IListItemDetails<IRepositoryItem>,
        key?: string
    ): JSX.Element => {
        return (
            <ListItem key={key || "list-item" + index} index={index} details={details}>
                <div className="list-example-row flex-row h-scroll-hidden">
                    <img alt="" className="contributed-icon contributed-icon-image bolt-image flex-noshrink"
                        style={{ width: 24, height: 24, marginTop: 12 }}
                        src="https://cdn.vsassets.io/ext/ms.vss-code-web/common-content/Nav-Code.0tJczmQtl3hyKtlh.png" />
                    <div
                        style={{ marginLeft: "10px", padding: "10px 0px" }}
                        className="flex-column h-scroll-hidden"
                    >
                        <span className="text-ellipsis">{item.name}</span>
                        <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
                            The {item.name} repository
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
            var repos = await new BackendService(project.id).getAllRepositories();
            this.setState({
                projectName: project.name,
                projectId: project.id,
                repos: repos,
                loading: false
            });
        }
    }
}