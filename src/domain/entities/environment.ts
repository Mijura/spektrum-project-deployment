import { DeploymentReport } from "@domain/entities/deployment-report"
import { Service } from "./service"

export enum EnvironmentType{
    'DEVELOPMENT',
    'TEST',
    'PRODUCTION'
}

export class Environment {
    readonly id: string
    readonly url: string
    readonly type: EnvironmentType
    services: Service[]
    deploymentReports: DeploymentReport[]
  
    constructor(id: string, url: string) {
        this.id = id
        this.url = url
        this.deploymentReports = []
    }
  
    addDeploymentReport(deployment: DeploymentReport) {
        this.deploymentReports.push(deployment)
    }

    addService(service: Service) {
        this.services.push(service)
    }
}
  