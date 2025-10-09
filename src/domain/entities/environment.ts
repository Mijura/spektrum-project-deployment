import { DeploymentReport } from "@domain/entities/deployment-report"

export enum EnvironmentType{
    'DEVELOPMENT',
    'TEST',
    'PRODUCTION'
}

export class Environment {
    readonly id: string
    readonly url: string
    readonly type: EnvironmentType
    deployments: DeploymentReport[]
  
    constructor(id: string, url: string) {
        this.id = id
        this.url = url
        this.deployments = []
    }
  
    addDeployment(deployment: DeploymentReport) {
        this.deployments.push(deployment)
    }
}
  