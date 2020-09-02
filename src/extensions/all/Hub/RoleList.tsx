

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
        id: "purpose",
        name: "Purpose",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
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
        width: new ObservableValue(400)
    },
    ColumnFill
];

interface IRoleListTableItem extends ISimpleTableCell {
    name: string;
    desc: string;
}


const items = new ArrayItemProvider<IRoleListTableItem>(
    [{
        purpose: 'P03278',
        name: 'Dev',
        desc: 'Dev Role allows you to create repository, commit changes manage builds.'
    },{
        purpose: 'P03278',
        name: 'Ops',
        desc: 'With Ops role you can manage relese management.'
    },{
        purpose: 'P03278',
        name: 'PO',
        desc: 'With PO role, you are accountable for manageing the backlogs.'
    }]
);


export class RoleList extends React.Component<{}, {}> {

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