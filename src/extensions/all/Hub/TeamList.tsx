

import * as React from "react";

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import {
    ColumnFill,
    ISimpleTableCell,
    renderSimpleCell,
    TableColumnLayout
} from "azure-devops-ui/Table";
import { Table } from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";


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
    ColumnFill
];

interface ITeamListTableItem extends ISimpleTableCell {
    name: string;
    desc: string;
}


const items = new ArrayItemProvider<ITeamListTableItem>(
    [{
        name: 'T-000122',
        desc: 'Murex Team'
    },{
        name: 'T000123',
        desc: 'Another Murex Team'
    },{
        name: 'T000124',
        desc: 'FinTech Team'
    }]
);


export class TeamList extends React.Component<{}, {}> {

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