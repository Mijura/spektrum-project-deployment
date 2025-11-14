import { Project } from "@domain/entities/project"

export interface DeploymentProvider {
    deployFrontend(service: Project): boolean
    deployBackend(service: Project): boolean
}