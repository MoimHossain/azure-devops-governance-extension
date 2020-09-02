

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
import { Toggle } from "azure-devops-ui/Toggle";
const gitlabToken = new ObservableValue<string>("");
const simpleObservable = new ObservableValue<string>("");
const gitlabRepoName = new ObservableValue<string>("");
const gitlabProjectName = new ObservableValue<string>("");
const repositoryInitialized = new ObservableValue<boolean>(true);
const importGitLabRepo = new ObservableValue<boolean>(false);
const demoPurposeID = "P03278";

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
            items.push({ text: "Commit", primary: true, onClick: () => this.createRepositoryAsync() });
        }
        return items;
    }

    private generateIrgCode() {
        var gitLabSnippet = '';
        if(importGitLabRepo.value === true) {
            gitLabSnippet = `
                "importFrom": {
                    "gitUrl": "https://[do_not_change]@gitlab.ing.net/${gitlabProjectName.value}/${gitlabRepoName.value}",
                    "gitToken": "${btoa(gitlabToken.value)}"
                },`;
        }

        var lines = `
    {
        "type": "PurposeResourceDefinition",
        "version": "1.0",
        "purposeId": "${demoPurposeID}",
        "description": "Requested a new Git Repository",
        "resources": [{
            "type": "azuredevops.gitrepository",
            "name": "${demoPurposeID}-${simpleObservable.value}",
            "resourceProperties": {${gitLabSnippet}
                "uninitialized": ${(repositoryInitialized.value === false).toString()}
            }
        }]
    }
        `;
        return lines;
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
                            titleProps={{ text: "New Git Repository" }}
                            description={
                                "Please follow the steps below:"
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
                                        placeholder="Enter Repository Name (without Purpose ID)"
                                        width={TextFieldWidth.standard}
                                    /><br/>
                                    <Toggle
                                        offText={"Do not initialize the repository"}
                                        onText={"Initialize the repository"}
                                        checked={repositoryInitialized}
                                        onChange={(event, value) => {
                                            repositoryInitialized.value = value;
                                            this.forceUpdate();
                                        }}
                                    /><br/><br/>
                                    <Toggle
                                        offText={"Do not import GitLab repository"}
                                        onText={"Import GitLab repository"}
                                        checked={importGitLabRepo}
                                        onChange={(event, value) => {
                                            importGitLabRepo.value = value;
                                            this.forceUpdate();
                                        }}
                                    /><br/><br/>
                                    {
                                        importGitLabRepo.value === true &&                                 
                                        <div>
                                            <TextField
                                                value={gitlabProjectName}
                                                readOnly={false}
                                                spellCheck={false}     
                                                required={true}                                   
                                                onChange={(e, newValue) => {
                                                    gitlabProjectName.value = newValue;
                                                    this.forceUpdate();
                                                }}
                                                placeholder="GitLab Project Name"
                                                width={TextFieldWidth.standard}
                                            /><br/>                                       
                                            <TextField
                                                value={gitlabRepoName}
                                                readOnly={false}
                                                spellCheck={false}     
                                                required={true}                                   
                                                onChange={(e, newValue) => {
                                                    gitlabRepoName.value = newValue;
                                                    this.forceUpdate();
                                                }}
                                                placeholder="GitLab Repository Name"
                                                width={TextFieldWidth.standard}
                                            /><br/>
                                            <TextField
                                                ariaLabel="Aria label"
                                                placeholder="GitLab Token"
                                                value={gitlabToken}
                                                onChange={(e, newValue) => {
                                                    gitlabToken.value = newValue;
                                                    this.forceUpdate();
                                                }}
                                                multiline
                                                rows={4}
                                                width={TextFieldWidth.standard}
                                            />                                                                           
                                        </div>
                                    }
                                                                                                          

                                    <br/>

                                    <span>Repository Name: <b>{demoPurposeID}-{simpleObservable.value}</b></span>

                                    <br/><br/>
                                    <span>Add the following code in your <i>resource.json</i> file in IRG resource reopository (<b>P03278-Default</b>) merge the changes to <i>master</i> branch.</span>
                                    <br/>
                                    <pre style={{
                                        width: 440,
                                        borderColor: 'darkgray',
                                        borderWidth: 1,
                                        borderStyle: 'solid',
                                        overflowX: 'auto',
                                        backgroundColor: 'black'
                                    }}>
                                        <code>
                                            {this.generateIrgCode()}
                                        </code>
                                    </pre><br/>


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