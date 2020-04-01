import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { Card } from "azure-devops-ui/Card";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { showRootComponent } from "../../Common";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Animation } from './../images/Animation';
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";

export interface ISuccessComponentProps {
    serverName?: string;
    agentPoolName?: string;
}
export interface IPipelineState {
    testingInProgress?: boolean;
    connectionIsTested?: boolean;
}

class PipelineHubContent extends React.Component<{}, IPipelineState> {
    private selectedOsType = new ObservableValue<string>("");
    private targetServerName = new ObservableValue<string>("");
    private targetAgentPool = new ObservableValue<string>("");
    private testConnectionSuccess: string = "The target server is reachble";
    private testConnectionFail: string = "The target server is unreachble";

    constructor(props: {}) {
        super(props);
        this.state = {
            connectionIsTested: false,
            testingInProgress: false
        };
    }

    private message: string = "View and manage pipelines within your Purpose (P0003).";
    public componentDidMount() {
        SDK.init();
    }
    private onSelectOsType = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
        this.selectedOsType.value = item.text || "";
        if (this.selectedOsType.value === 'Linux OS') {
            this.targetAgentPool.value = "CDaaSLinux";
        } else {
            this.targetAgentPool.value = "CDaaSWin";
        }

        this.setState({
            connectionIsTested: false
        });
    };
    private onSelectNetwork = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
        this.setState({
            connectionIsTested: false
        });
    };

    public render(): JSX.Element {
        const iframeUrl = window.location.href;
        const isV2 = window.location.search.indexOf("v2=true") >= 0;
        return (
            <Page className="sample-hub flex-grow">
                <Header title={"Build Pipelines" + (isV2 ? " (version 2)" : "")} />

                <div className="page-content page-content-top flex-column rhythm-vertical-16">
                    <MessageCard
                        className="flex-self-stretch"
                        severity={MessageCardSeverity.Info}
                    >
                        {this.message}
                    </MessageCard>


                    <Card>

                        <table style={{ border: 'none' }}>
                            <tr>
                                <td style={{ width: 300 }}>Release Agent OS Type:</td>
                                <td>
                                    <Dropdown
                                        className="example-dropdown"
                                        placeholder="Select"
                                        items={[
                                            { id: "item1", text: "Windows OS" },
                                            { id: "item2", text: "Linux OS" }
                                        ]}
                                        onSelect={this.onSelectOsType}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: 300 }}>Target Network:</td>
                                <td>
                                    <Dropdown
                                        className="example-dropdown"
                                        placeholder="Select"
                                        items={[
                                            { id: "1", text: "IPC" },
                                            { id: "2", text: "DCN/MD(x)" },
                                            { id: "3", text: "DCN/BZO" }
                                        ]}
                                        onSelect={this.onSelectNetwork}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: 300 }}>Target Server:</td>
                                <td>
                                    <TextField
                                        value={this.targetServerName}
                                        onChange={(e, newValue) => {
                                            this.targetServerName.value = newValue;

                                            this.setState({
                                                connectionIsTested: false
                                            });
                                        }}
                                        placeholder="IP or Hostname"
                                        width={TextFieldWidth.standard}
                                    />
                                </td>
                            </tr>
                        </table>
                    </Card>


                    <Card>
                        <table style={{ border: 'none' }}>
                            <tr>
                                <td style={{ width: 300 }}>Agent Pool (Recommended):</td>
                                <td>
                                    <TextField
                                        value={this.targetAgentPool}
                                        readOnly={true}
                                        onChange={(e, newValue) => (this.targetAgentPool.value = newValue)}
                                        placeholder="<<Recommended Agent Pool>>"
                                        width={TextFieldWidth.standard}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: 300 }}></td>
                                <td align="right">
                                    <ButtonGroup>
                                        <Button
                                            text="Test Connection"
                                            disabled={this.state.testingInProgress === true}
                                            onClick={() => {
                                                this.setState({
                                                    connectionIsTested: true,
                                                    testingInProgress: true
                                                })

                                                setTimeout(() => {
                                                    this.setState({
                                                        testingInProgress: false
                                                    })
                                                }, 1500);
                                            }}
                                        />
                                    </ButtonGroup>

                                </td>
                            </tr>
                        </table>
                    </Card>


                    {
                        this.state.connectionIsTested && <Card>
                            {this.state.testingInProgress && <Animation />}

                            {
                                this.state.testingInProgress === false && <div>
                                    {
                                        this.targetAgentPool.value === "CDaaSWin" && <ConnectionSuccessComponent
                                            agentPoolName={this.targetAgentPool.value}
                                            serverName={this.targetServerName.value} />
                                    }
                                    {
                                        this.targetAgentPool.value === "CDaaSLinux" && <ConnectionFailedComponent
                                            agentPoolName={this.targetAgentPool.value}
                                            serverName={this.targetServerName.value} />
                                    }

                                    <PortMatrixComponent />
                                </div>
                            }
                        </Card>
                    }


                </div>


            </Page>
        );
    }
}

class ConnectionSuccessComponent extends React.Component<ISuccessComponentProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                <table>
                    <tr>
                        <td style={{ width: 24 }}>
                            <Status
                                {...Statuses.Success}
                                key="success"
                                size={StatusSize.m}
                                className="flex-self-center "
                            />
                        </td>
                        <td>
                            <h3 style={{ paddingBottom: 4 }}>Great, agent ({this.props.agentPoolName}) can successfully reach to target server ({this.props.serverName}). </h3>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <Button
                                text="Empty Pipeline"
                                tooltipProps={{ text: 'Create a Relaese pipeline with the recommended Agent Pool' }}
                                iconProps={{ iconName: "Add" }}
                                primary={true}
                                onClick={() => alert("TODO!")}
                            />
                        </td>
                    </tr>
                </table>

            </div>
        );
    }
}


class ConnectionFailedComponent extends React.Component<ISuccessComponentProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                <table>
                    <tr>
                        <td style={{ width: 24 }}>
                            <Status
                                {...Statuses.Failed}
                                key="failed"
                                size={StatusSize.m}
                                className="flex-self-center "
                            />
                        </td>
                        <td>
                            <h3 style={{ paddingBottom: 4 }}>Nope, agent ({this.props.agentPoolName}) can't reach to target server ({this.props.serverName}). </h3>
                        </td>
                    </tr>
                </table>


                <p>You need to request a firewall change in the IPC portal. More info is at <a href="#"><span>Enable IPC deployment (Linux)</span></a>.</p>

                <p>We have our RCEC’s in place to deploy to any datacenter, please check if you can reach them and make arrangement with your local datacenter firerwall’s to open the necessary ports.</p>

                <p>RCEC / RCIC: Documentation describing the connection needs to be created and reviewed by the Review Committee External/Internal Connections.</p>

                <table>
                    <tr>
                        <td style={{ width: 300 }}>

                        </td>
                        <td>
                            <ButtonGroup>
                                <Button
                                    text="RCEC Request"
                                    tooltipProps={{ text: 'Create a RCEC request for required Firewall rule(s).' }}
                                    iconProps={{ iconName: "Add" }}
                                    onClick={() => alert("TODO!")}
                                />
                                <Button
                                    text="Empty Pipeline"
                                    tooltipProps={{ text: 'Create a Relaese pipeline with the recommended Agent Pool' }}
                                    iconProps={{ iconName: "Add" }}
                                    primary={true}
                                    onClick={() => alert("TODO!")}
                                />
                            </ButtonGroup>
                        </td>
                    </tr>
                </table>

            </div>
        );
    }
}

class PortMatrixComponent extends React.Component<{}, {}> {

    public render(): JSX.Element {
        const cellStyle = {
            width: 80,
            paddingLeft: 8,
            paddingRight: 8,            
            border: "1px solid "
        };
        const cellStyleCenter = {
            paddingLeft: 8,
            paddingRight: 8,
            border: "1px solid "
        };

        return (
            <p>
                <h4>Release Agent machines in every data center offers a limited set of open ports.</h4>

                <table>
                    <tr>
                        <td style={{ width: 300 }}>

                        </td>
                        <td>

                        <table style={{ borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={cellStyle}>Service</th>
                                    <th align="center" style={cellStyleCenter}>Port(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={cellStyle}>bash</td>
                                    <td align="center" style={cellStyleCenter}>22</td>
                                </tr>
                                <tr>
                                    <td style={cellStyle}>https</td>
                                    <td align="center" style={cellStyleCenter}>443 / 8443</td>
                                </tr>
                                <tr>
                                    <td style={cellStyle}>SMB+</td>
                                    <td align="center" style={cellStyleCenter}>445</td>
                                </tr>
                            </tbody>
                        </table>


                        </td>
                    </tr>
                </table>




            </p>
        );
    }
}

showRootComponent(<PipelineHubContent />);