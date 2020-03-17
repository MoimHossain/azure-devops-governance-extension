

import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { operationsColumns, operationTableRows } from "./SampleData";

import { Table } from "azure-devops-ui/Table";



export interface IOperationTabState {

}


export class OperationTab extends React.Component<{}, IOperationTabState> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.initialize();
    }

    public render(): JSX.Element {
        return (
            <div className="page-content page-content-top flex-column rhythm-vertical-16">
                <Card>
                    <Table columns={operationsColumns} itemProvider={operationTableRows} role="table" />
                </Card>
            </div>
        );
    }

    private async initialize() {

    }
}