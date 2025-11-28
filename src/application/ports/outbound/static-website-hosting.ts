import { DeploymentTarget } from "@domain/entities/deployment-target"

export interface StaticWebsiteHosting {
    deploy(target: DeploymentTarget): Promise<string>
}