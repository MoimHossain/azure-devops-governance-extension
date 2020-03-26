

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
                    </div>

                    <div style={{
                        width: '100%',
                        height: 'auto',
                        padding: '1%'
                    }}>
                    
                    
                    </div>                    
                </Card>
            </div>
        );
    }

    private async initialize() {

                }
}