import { DeploymentTarget } from "@domain/value-objects/deployment-target"

export interface StaticWebsiteHosting {
    deploy(target: DeploymentTarget): Promise<void>
}