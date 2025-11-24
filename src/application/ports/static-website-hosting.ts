import { Project } from "@domain/entities/project"
import { EnvironmentType } from "@domain/value-objects/environment"

export interface StaticWebsiteHosting {
    deployToEnvironment(project: Project, environment: EnvironmentType): Promise<string>
}