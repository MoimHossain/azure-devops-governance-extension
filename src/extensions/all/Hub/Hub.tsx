import "./Hub.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";

// import { OverviewTab } from "./OverviewTab"; 
// import { ExtensionDataTab } from "./ExtensionDataTab";
// import { MessagesTab } from "./MessagesTab";

import { AcrTab } from './AcrTab';
import { HomeTab } from './Home';

import { KeyVaultTab } from './KeyVault';
import { PackageFeedTab } from './PackageFeedTab';
import { RepositoryTab } from './RepositoryTab';

import { OperationTab } from './OperationTab';
import { showRootComponent } from "../../common";

interface IHubContentState {
    selectedTabId: string;
    fullScreenMode: boolean;
    headerDescription?: string;
    useLargeTitle?: boolean;
    useCompactPivots?: boolean;
}

class HubContent extends React.Component<{}, IHubContentState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            selectedTabId: "overview",
            fullScreenMode: false
        };
    }

    public componentDidMount() {
        SDK.init();
        this.initializeFullScreenState();
    }

    public render(): JSX.Element {

        const { selectedTabId, headerDescription, useCompactPivots, useLargeTitle } = this.state;

        return (
            <Page className="sample-hub flex-grow">

                <Header title="Governance Assistance"
                    commandBarItems={this.getCommandBarItems()}
                    description={headerDescription}
                    titleSize={useLargeTitle ? TitleSize.Large : TitleSize.Medium} />

                <TabBar
                    onSelectedTabChanged={this.onSelectedTabChanged}
                    selectedTabId={selectedTabId}
                    tabSize={useCompactPivots ? TabSize.Compact : TabSize.Tall}>

                    <Tab name="Overview" id="overview" />
                    <Tab name="Repositories" id="repository" />
                    <Tab name="Key Vaults" id="key-vault" />                    
                    <Tab name="Package Feeds" id="package-feed" />                   
                    <Tab name="Container Registries" id="container-registry" />
                    <Tab name="Operations" id="history" />
                </TabBar>

                { this.getPageContent() }
            </Page>
        );
    }

    private onSelectedTabChanged = (newTabId: string) => {
        this.setState({
            selectedTabId: newTabId
        })
    }

    private getPageContent() {
        const { selectedTabId } = this.state;
        if (selectedTabId === "overview") {
            return <HomeTab />;
        }
        else if (selectedTabId === "repository") {
            return <RepositoryTab />;
        }
        else if (selectedTabId === "package-feed") {
            return <PackageFeedTab />;
        }
        else if (selectedTabId === "container-registry") {
            return <AcrTab />;
        }
        else if(selectedTabId === "key-vault") {
            return <KeyVaultTab />;
        }
        else if (selectedTabId === "history") {
            return <OperationTab />;
        }
    }

    private getCommandBarItems(): IHeaderCommandBarItem[] {
        return [
            {
              id: "panel",
              text: "Repository",
              onActivate: () => { this.onPanelClick() },
              iconProps: {
                iconName: 'Add'
              },
              isPrimary: true,
              tooltipProps: {
                text: "Create Repository in Purpose using IRG"
              }
            },
            {
                id: "fullScreen",
                ariaLabel: this.state.fullScreenMode ? "Exit full screen mode" : "Enter full screen mode",
                iconProps: {
                    iconName: this.state.fullScreenMode ? "BackToWindow" : "FullScreen"
                },
                onActivate: () => { this.onToggleFullScreenMode() }
            },
            {
                id: "panel",
                text: "KeyVault",
                onActivate: () => { this.onPanelClick() },
                iconProps: {
                  iconName: 'Add'
                },
                tooltipProps: {
                  text: "Create KeyVault in Purpose using IRG"
                }
            },
            {
                id: "panel",
                text: "Package Feed",
                onActivate: () => { this.onPanelClick() },
                iconProps: {
                  iconName: 'Add'
                },
                tooltipProps: {
                  text: "Create Package Feed in Purpose using IRG"
                }
            },
            {
                id: "panel",
                text: "Container Registry",
                onActivate: () => { this.onPanelClick() },
                iconProps: {
                  iconName: 'Add'
                },
                tooltipProps: {
                  text: "Create Azure Container Registry in Purpose using IRG"
                }
            }
        ];
    }
    /*,
            {
              id: "customDialog",
              text: "Custom Dialog",
              onActivate: () => { this.onCustomPromptClick() },
              tooltipProps: {
                text: "Open a dialog with custom extension content"
              }
            },
            {
              id: "messageDialog",
              text: "Message",
              onActivate: () => { this.onMessagePromptClick() },
              tooltipProps: {
                text: "Open a simple message dialog"
              }
            }*/

    private async onMessagePromptClick(): Promise<void> {
        const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
        dialogService.openMessageDialog("Use large title?", {
            showCancel: true,
            title: "Message dialog",
            onClose: (result) => {
                this.setState({ useLargeTitle: result });
            }
        });
    }

    private async onCustomPromptClick(): Promise<void> {
        const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
        dialogService.openCustomDialog<boolean | undefined>(SDK.getExtensionContext().id + ".panel-content", {
            title: "Custom dialog",
            configuration: {
                message: "Use compact pivots?",
                initialValue: this.state.useCompactPivots
            },
            onClose: (result) => {
                if (result !== undefined) {
                    this.setState({ useCompactPivots: result });
                }
            }
        });
    }

    private async onPanelClick(): Promise<void> {
        const panelService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
        panelService.openPanel<boolean | undefined>(SDK.getExtensionContext().id + ".panel-content", {
            title: "New Repository",
            description: "Please fill out the following info.",
            configuration: {
                message: "Show header description?",
                initialValue: !!this.state.headerDescription
            },
            onClose: (result) => {
                if (result !== undefined) {
                    this.setState({ headerDescription: result ? "This is a header description" : undefined });
                }
            }
        });
    }

    private async initializeFullScreenState() {
        const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
        const fullScreenMode = await layoutService.getFullScreenMode();
        if (fullScreenMode !== this.state.fullScreenMode) {
            this.setState({ fullScreenMode });
        }
    }

    private async onToggleFullScreenMode(): Promise<void> {
        const fullScreenMode = !this.state.fullScreenMode;
        this.setState({ fullScreenMode });

        const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
        layoutService.setFullScreenMode(fullScreenMode);
    }
}

showRootComponent(<HubContent />);