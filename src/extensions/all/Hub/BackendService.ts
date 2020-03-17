
import * as SDK from "azure-devops-extension-sdk";

const backendHost = "https://azuredevops-restapi.azurewebsites.net/api";


export class BackendService {
    private projectId?:string

    constructor(projectId: string) {
        this.projectId = projectId;
    }

    
    public async getAcrs(): Promise<any> {
      const token = await SDK.getAppToken(); 
      const response = await fetch(`${backendHost}/${this.projectId}/repository`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      const repoColl = await response.json();
      return repoColl;
  }

    public async getKeyVaults(): Promise<any> {
      const token = await SDK.getAppToken(); 
      const response = await fetch(`${backendHost}/${this.projectId}/repository`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      const repoColl = await response.json();
      return repoColl;
  }

    public async getAllRepositories(): Promise<any> {
        const token = await SDK.getAppToken(); 
        const response = await fetch(`${backendHost}/${this.projectId}/repository`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        const repoColl = await response.json();
        return repoColl;
    }
};
