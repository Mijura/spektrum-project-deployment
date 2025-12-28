import { EntryPoint } from "@app/value-objects/entry-point"
import { EnvironmentType } from "@domain/value-objects/environment"

export interface GetEntryPoint {
    execute(projectId: string, envType: EnvironmentType): Promise<EntryPoint>
}