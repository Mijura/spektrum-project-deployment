import { Deployment } from "@domain/entities/deployment"

export enum EnvironmentType{
    'DEVELOPMENT',
    'TEST',
    'PRODUCTION'
}

export class Environment {
    readonly id: string
    readonly url: string
    readonly type: EnvironmentType
    deployments: Deployment[]
  
    constructor(id: string, url: string) {
        this.id = id
        this.url = url
        this.deployments = []
    }
  
    addDeployment(deployment: Deployment) {
        this.deployments.push(deployment)
    }
}
  