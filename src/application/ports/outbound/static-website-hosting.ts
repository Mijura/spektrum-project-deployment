import { DeploymentTarget } from "@domain/entities/deployment-target"
import { Service } from "@domain/value-objects/target-service"

export interface StaticWebsiteHosting {
    deploy(target: DeploymentTarget<Service>): Promise<void>
}