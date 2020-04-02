

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

export interface IBuildListProps {
    builds?: any[];
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
        name: "Last Build",
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



export class BuildList extends React.Component<IBuildListProps, {}> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }


    public render(): JSX.Element {
        const items: any[] = [];
        if(this.props.builds) {
            this.props.builds.forEach(item => {
                if(item.path.indexOf("P0002") > -1) {
                    items.push({
                        name: item.name,
                        lastRun: item.latestBuild ? item.latestBuild : 'Never',
                        createdBy: item.authoredBy.displayName
                    });                    
                }
            });
        }

        return (
            <div className="page-content page-content-top flex-column rhythm-vertical-16">
                <Table columns={columns} itemProvider={new ArrayItemProvider<ITeamListTableItem>(items)} role="table" />
            </div>
        );
    }
}