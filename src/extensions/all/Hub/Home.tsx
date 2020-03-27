

import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { Images } from './../images/Images';

import { PurposeList } from './PurposeList';
import { TeamList } from './TeamList';
import { RoleList } from './RoleList';
import { TitleSize } from "azure-devops-ui/Header";

const logoPath = (new Images()).getLogoIcon();

export class HomeTab extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render(): JSX.Element {
        return (
            <div className="page-content page-content-top flex-column rhythm-vertical-16">
                <Card titleProps={{
                    text: "",
                    size: TitleSize.Medium
                }}>
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
                </Card>


                <Card titleProps={{
                    text: "Purposes I contribute",
                    size: TitleSize.Medium
                }}>
                    <PurposeList />
                </Card>
                <Card titleProps={{
                    text: "Teams I belong",
                    size: TitleSize.Medium
                }}>
                    <TeamList />
                </Card>
                <Card titleProps={{
                    text: "Roles I have",
                    size: TitleSize.Medium
                }}>
                    <RoleList />
                </Card>                                
            </div>
        );
    }
}