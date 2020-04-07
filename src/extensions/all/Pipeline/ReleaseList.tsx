

import * as React from "react";
import "./TableStyle.scss";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import {
    ColumnFill,
    ISimpleTableCell,
    renderSimpleCell,
    TableColumnLayout
} from "azure-devops-ui/Table";
import { Table } from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

export interface IReleaseListProps {
    releases?: any[];
}

const columns = [
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "name",
        name: "Name",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(340)
    },
    {
        id: "lastRun",
        name: "Last Release",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    {
        id: "createdBy",
        name: "Created By",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    ColumnFill
];

interface ITeamListTableItem extends ISimpleTableCell {
    name: string;
    lastRun: string;
    createdBy: string;
}



export class ReleaseList extends React.Component<IReleaseListProps, {}> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }


    public render(): JSX.Element {
        const items: any[] = [];
        if (this.props.releases) {
            this.props.releases.forEach(item => {

                if (item.path.indexOf("P0002") > -1) {
                    items.push({
                        name: item.name,
                        lastRun: item.lastRelease ? item.lastRelease : 'Never',
                        createdBy: item.createdBy.displayName
                    });
                }
            });
        }

        return (
            <Table containerClassName="cloudoven-filled-table" columns={columns} itemProvider={new ArrayItemProvider<ITeamListTableItem>(items)} role="table" />
        );
    }
}