import * as React from "react";

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { ISimpleListCell } from "azure-devops-ui/List";
import { MenuItemType } from "azure-devops-ui/Menu";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import {
    ColumnFill,
    ColumnMore,
    ColumnSelect,
    ISimpleTableCell,
    renderSimpleCell,
    TableColumnLayout
} from "azure-devops-ui/Table";
import { css } from "azure-devops-ui/Util";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

export interface ITableItem extends ISimpleTableCell {
    name: ISimpleListCell;
    age: number;
    gender: string;
}

export interface IPackageFeedTableItem extends ISimpleTableCell {
    name: ISimpleListCell;
    count: number;
    uri: string;
}

export interface IOperationTableItem extends ISimpleTableCell {
    name: ISimpleListCell;
    who: string;
    approvedBy: string;
    when: string;
    status: string;
}


export interface ILocationTableItem extends ISimpleTableCell {
    city: string;
    continent: ISimpleListCell;
    country: string;
    name: string;
    server: string;
    state: string;
}

export const packageFeedColumns = [
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "name",
        name: "Feed Name",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    {
        id: "uri",
        name: "URI",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    {
        columnLayout: TableColumnLayout.none,
        id: "count",
        name: "Package Count",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    ColumnFill
];

export const fixedColumns = [
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "name",
        name: "Name",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    {
        id: "age",
        name: "Age",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    {
        columnLayout: TableColumnLayout.none,
        id: "gender",
        name: "Gender",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    ColumnFill
];

export const checkboxColumns = [
    new ColumnSelect(),
    {
        id: "name",
        name: "Name",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    {
        id: "age",
        name: "Age",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    {
        id: "gender",
        name: "Gender",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    ColumnFill
];

export function onSizeMore(event: MouseEvent, index: number, width: number) {
    (operationsColumns[index].width as ObservableValue<number>).value = width;
}

export const operationsColumns = [
    {
        id: "name",
        minWidth: 50,
        name: "Name",
        onSize: onSizeMore,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    {
        id: "who",
        maxWidth: 300,
        name: "Initiated By",
        onSize: onSizeMore,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    {
        id: "approved",
        maxWidth: 300,
        name: "Approved By",
        onSize: onSizeMore,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    {
        id: "status",
        name: "Status",
        onSize: onSizeMore,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    ColumnFill
];

/*

,
    new ColumnMore(() => {
        return {
            id: "sub-menu",
            items: [
                { id: "submenu-one", text: "Cancel" },
                { id: "submenu-two", text: "Defer" },
                { id: "divider", itemType: MenuItemType.Divider },
                { id: "submenu-three", checked: true, readonly: true, text: "ToDo" },
                { id: "submenu-four", disabled: true, text: "ToDO" }
            ]
        };
    })*/

export const renderStatus = (className?: string) => {
    return (
        <Status
            {...Statuses.Success}
            ariaLabel="Success"
            className={css(className, "bolt-table-status-icon")}
            size={StatusSize.s}
        />
    );
};

export const operationTableItems: IOperationTableItem[] = [
    {
        who: 'Moim Hossain',
        approvedBy: 'Moim Hossain',
        when: '17 Mar 2020',
        status: 'Completed',
        name: { iconProps: { render: renderStatus }, text: "New Repository (P00012-Repository)" }
    },
    {
        who: 'Moim Hossain',
        approvedBy: 'Moim Hossain',
        when: '17 Mar 2020',
        status: 'Completed',
        name: { iconProps: { render: renderStatus }, text: "New KeyVault (P00012-KeyVault)" }
    },
    {
        who: 'Moim Hossain',
        approvedBy: 'Moim Hossain',
        when: '17 Mar 2020',
        status: 'Completed',
        name: { iconProps: { render: renderStatus }, text: "New Package Feed (P00012-Incoming PackageFeed)" }
    },
    {
        who: 'Moim Hossain',
        approvedBy: 'Moim Hossain',
        when: '17 Mar 2020',
        status: 'Completed',
        name: { iconProps: { render: renderStatus }, text: "New Repository (P00012-Repository)" }
    },
    {
        who: 'Moim Hossain',
        approvedBy: 'Moim Hossain',
        when: '17 Mar 2020',
        status: 'Completed',
        name: { iconProps: { render: renderStatus }, text: "New KeyVault (P00012-KeyVault)" }
    },
    {
        who: 'Moim Hossain',
        approvedBy: 'Moim Hossain',
        when: '17 Mar 2020',
        status: 'Completed',
        name: { iconProps: { render: renderStatus }, text: "New Package Feed (P00012-Incoming PackageFeed)" }
    }    
];


export const feedTableTableItems: IPackageFeedTableItem[] = [
    {
        uri: 'https://package-feed/maven',
        count: 55,
        name: { iconProps: { render: renderStatus }, text: "Maven" }
    },
    {
        count: 49,
        uri: 'https://package-feed/maven',
        name: { iconProps: { iconName: "Home", ariaLabel: "Home" }, text: "NuGet" }
    },
    {
        count: 18,
        uri: 'https://package-feed/maven',
        name: { iconProps: { iconName: "Home", ariaLabel: "Home" }, text: "npm" }
    }
];

export const rawTableItems: ITableItem[] = [
    {
        age: 50,
        gender: "M",
        name: { iconProps: { render: renderStatus }, text: "Rory Boisvert" }
    },
    {
        age: 49,
        gender: "F",
        name: { iconProps: { iconName: "Home", ariaLabel: "Home" }, text: "Sharon Monroe" }
    },
    {
        age: 18,
        gender: "F",
        name: { iconProps: { iconName: "Home", ariaLabel: "Home" }, text: "Lucy Booth" }
    }
];

export const tableItems = new ArrayItemProvider<ITableItem>(rawTableItems);
export const tableItemsNoIcons = new ArrayItemProvider<ITableItem>(
    rawTableItems.map((item: ITableItem) => {
        const newItem = Object.assign({}, item);
        newItem.name = { text: newItem.name.text };
        return newItem;
    })
);


export const operationTableRows = new ArrayItemProvider<IOperationTableItem>(
    operationTableItems.map((item: IOperationTableItem) => {
        const newItem = Object.assign({}, item);
        newItem.name = { text: newItem.name.text };
        return newItem;
    })
);


export const packageFeedItems = new ArrayItemProvider<IPackageFeedTableItem>(
    feedTableTableItems.map((item: IPackageFeedTableItem) => {
        const newItem = Object.assign({}, item);
        newItem.name = { text: newItem.name.text };
        return newItem;
    })
);



export const locationTableItems: ILocationTableItem[] = [
    {
        city: "San Francisco",
        continent: { text: "North America" },
        country: "United States",
        name: "Mission District",
        server: "West US",
        state: "California"
    },
    {
        city: "Paris",
        continent: { text: "Europe", href: "#" },
        country: "France",
        name: "Batignolles-Monceau",
        server: "West Europe",
        state: "Ile-de-France"
    },
    {
        city: "Seoul",
        continent: { iconProps: { iconName: "Home", ariaLabel: "Home" }, text: "Asia" },
        country: "South Korea",
        name: "Gangnam",
        server: "East Asia",
        state: "Gyeonggi"
    },
    {
        city: "Montevideo",
        continent: {
            href: "#",
            iconProps: { iconName: "Home", ariaLabel: "Home" },
            text: "South America"
        },
        country: "Uruguay",
        name: "Atahualapa",
        server: "Brazil South",
        state: "Departmento de Montevideo"
    }
];

enum PipelineStatus {
    running = "running",
    succeeded = "succeeded",
    failed = "failed",
    warning = "warning"
}

export enum ReleaseType {
    prAutomated,
    tag,
    scheduled,
    manual
}

function modifyNow(days: number, hours: number, minutes: number, seconds: number): Date {
    const now = new Date();
    const newDate = new Date(now as any);
    newDate.setDate(now.getDate() + days);
    newDate.setHours(now.getHours() + hours);
    newDate.setMinutes(now.getMinutes() + minutes);
    newDate.setSeconds(now.getSeconds() + seconds);
    return newDate;
}

export const pipelineItems = [
    {
        favorite: new ObservableValue<boolean>(true),
        lastRunData: {
            branchName: "master",
            endTime: modifyNow(0, -1, 23, 8),
            prId: 482,
            prName: "Added testing for get_service_instance_stats",
            releaseType: ReleaseType.prAutomated,
            startTime: modifyNow(0, -1, 0, 0)
        },
        name: "enterprise-distributed-service",
        status: PipelineStatus.running
    },
    {
        favorite: new ObservableValue<boolean>(true),
        lastRunData: {
            branchName: "master",
            endTime: modifyNow(-1, 0, 5, 2),
            prId: 137,
            prName: "Update user service",
            releaseType: ReleaseType.tag,
            startTime: modifyNow(-1, 0, 0, 0)
        },
        name: "microservice-architecture",
        status: PipelineStatus.succeeded
    },
    {
        favorite: new ObservableValue<boolean>(false),
        lastRunData: {
            branchName: "master",
            endTime: modifyNow(0, -2, 33, 1),
            prId: 32,
            prName: "Update user service",
            releaseType: ReleaseType.scheduled,
            startTime: modifyNow(0, -2, 0, 0)
        },
        name: "mobile-ios-app",
        status: PipelineStatus.succeeded
    },
    {
        favorite: new ObservableValue<boolean>(false),
        lastRunData: {
            branchName: "test",
            endTime: modifyNow(0, -4, 4, 17),
            prId: 385,
            prName: "Add a request body validator",
            releaseType: ReleaseType.prAutomated,
            startTime: modifyNow(0, -4, 0, 0)
        },
        name: "node-package",
        status: PipelineStatus.succeeded
    },
    {
        favorite: new ObservableValue<boolean>(false),
        lastRunData: {
            branchName: "develop",
            endTime: modifyNow(0, -6, 2, 8),
            prId: 792,
            prName: "Clean up notifications styling",
            releaseType: ReleaseType.manual,
            startTime: modifyNow(0, -6, 0, 0)
        },
        name: "parallel-stages",
        status: PipelineStatus.failed
    },
    {
        favorite: new ObservableValue<boolean>(false),
        lastRunData: {
            branchName: "feature-123",
            endTime: modifyNow(-2, 0, 49, 52),
            prId: 283,
            prName: "Add extra padding on cells",
            releaseType: ReleaseType.prAutomated,
            startTime: modifyNow(-2, 0, 0, 0)
        },
        name: "simple-web-app",
        status: PipelineStatus.warning
    }
];

interface IPipelineLastRun {
    startTime?: Date;
    endTime?: Date;
    prId: number;
    prName: string;
    releaseType: ReleaseType;
    branchName: string;
}

export interface IPipelineItem {
    name: string;
    status: PipelineStatus;
    lastRunData: IPipelineLastRun;
    favorite: ObservableValue<boolean>;
}

interface IStatusIndicatorData {
    statusProps: IStatusProps;
    label: string;
}

export function getStatusIndicatorData(status: string): IStatusIndicatorData {
    status = status || "";
    status = status.toLowerCase();
    const indicatorData: IStatusIndicatorData = {
        label: "Success",
        statusProps: { ...Statuses.Success, ariaLabel: "Success" }
    };
    switch (status) {
        case PipelineStatus.failed:
            indicatorData.statusProps = { ...Statuses.Failed, ariaLabel: "Failed" };
            indicatorData.label = "Failed";
            break;
        case PipelineStatus.running:
            indicatorData.statusProps = { ...Statuses.Running, ariaLabel: "Running" };
            indicatorData.label = "Running";
            break;
        case PipelineStatus.warning:
            indicatorData.statusProps = { ...Statuses.Warning, ariaLabel: "Warning" };
            indicatorData.label = "Warning";

            break;
    }

    return indicatorData;
}

export function ReleaseTypeText(props: { releaseType: ReleaseType }) {
    switch (props.releaseType) {
        case ReleaseType.prAutomated:
            return "PR Automated";
        case ReleaseType.manual:
            return "Manually triggered";
        case ReleaseType.scheduled:
            return "Scheduled";
        default:
            return "Release new-features";
    }
}
