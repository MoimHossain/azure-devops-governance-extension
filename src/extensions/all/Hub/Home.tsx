

import * as React from "react";

import { Card } from "azure-devops-ui/Card";

export interface IHomeTabState {

}


export class HomeTab extends React.Component<{}, IHomeTabState> {

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
                    Welcome to Governance Assistance!

                    <br/>
                    Here goes some descriptions...!
                </Card>
            </div>
        );
    }

    private async initialize() {

    }
}