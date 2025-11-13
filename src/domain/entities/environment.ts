import { DeploymentReport } from "@domain/entities/deployment-report"
import { Service } from "./service"
import { v4 as uuidv4 } from "uuid"

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
  
    constructor(id: string, url: string, type: EnvironmentType) {
        this.id = id
        this.url = url
        this.type = type
        //this.deploymentReports = []
    }
  
    // addDeploymentReport(deployment: DeploymentReport) {
    //     this.deploymentReports.push(deployment)
    // }

    addService(service: Service) {
        this.services.push(service)
    }

    static create(url: string, type: EnvironmentType){
        const id = uuidv4()
        return new Environment(id, url, type)
    }

}
  