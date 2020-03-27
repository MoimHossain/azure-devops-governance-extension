

import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import {
    ColumnFill,
    ColumnMore,
    ColumnSelect,
    ISimpleTableCell,
    renderSimpleCell,
    TableColumnLayout
} from "azure-devops-ui/Table";
import { Table } from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ISimpleListCell } from "azure-devops-ui/List";

const columns = [
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "name",
        name: "Name",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    {
        id: "desc",
        name: "Description",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    {
        columnLayout: TableColumnLayout.none,
        id: "active",
        name: "Active",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(100)
    },
    ColumnFill
];

interface IPurposeListTableItem extends ISimpleTableCell {
    name: string;
    active: string;
    desc: string;
}


const items = new ArrayItemProvider<IPurposeListTableItem>(
    [{
        active: 'Yes',
        name: 'P000122',
        desc: 'Murex Purpose'
    },{
        active: 'No',
        name: 'P000123',
        desc: 'Another Murex Purpose'
    },{
        active: 'No',
        name: 'P000124',
        desc: 'FinTech Purpose'
    }]
);


export class PurposeList extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }


    public render(): JSX.Element {
        return (
            <div className="page-content page-content-top flex-column rhythm-vertical-16">
                <Table columns={columns} itemProvider={items} role="table" />
            </div>
        );
    }
}