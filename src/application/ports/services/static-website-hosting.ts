import { DeploymentTarget } from "@domain/deployment-target"

export interface StaticWebsiteHosting {
    deploy(target: DeploymentTarget): Promise<void>
}