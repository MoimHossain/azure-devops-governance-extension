

import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { packageFeedColumns, packageFeedItems } from "./SampleData";

import { Table } from "azure-devops-ui/Table";



export interface IPackageFeedTabState {

}


export class PackageFeedTab extends React.Component<{}, IPackageFeedTabState> {

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
                    <Table columns={packageFeedColumns} itemProvider={packageFeedItems} role="table" />
                </Card>
            </div>
        );
    }

    private async initialize() {

    }
}