import { EnvironmentType } from "@domain/value-objects/environment"

export interface GetEntryPoint {
    execute(projectId: string, envType: EnvironmentType): any
}