

import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { Images } from './../images/Images';

const logoPath = (new Images()).getLogoIcon();

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
                    <div style={{
                        width: '100%',
                        height: 'auto',
                        padding: '1%'
                    }}>
                        <div>
                            <img src={logoPath} style={{ 
                                width: 40, 
                                float: 'left',
                                marginLeft: '2%',
                                marginTop: 18,
                                height: 40 }} />
		                </div>
                        <div style={{marginLeft: 60, paddingLeft: 14}}>
                            <h1>Welcome to Governance Assistance!</h1>                         
                        </div>


                        <br/>
                        <br/>

                        <p>
                        You're contributing the following purposes:
                        <ul>
                            <li>P00123 (Active)</li>
                            <li>P00124</li>
                        </ul>
                    </p>

                    <p>
                        You are member of following Teams:
                        <ul>
                            <li>T00123-Dev</li>
                        </ul>
                    </p>

                    <p>
                        Your Role:
                        <u>
                            <li>Dev</li>
                            <li>Ops</li>
                        </u>
                    </p>
                    <p>
                        <b>Dev</b> Role: This role allows you to contribute to <b>Repositories</b>, creating
                        build pipelines etc.

                    </p>                        
                    </div>
                                 
                </Card>
            </div>
        );
    }

    private async initialize() {

                }
}