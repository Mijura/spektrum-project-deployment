import { DeploymentReport } from "@domain/entities/deployment-report"
import { Service } from "@domain/entities/service"

export interface DeploymentProvider {
    deployFrontend(service: Service): DeploymentReport
    deployBackend(service: Service): DeploymentReport
}