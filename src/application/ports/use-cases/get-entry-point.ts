import { EntryPoint } from "@app/value-objects/entry-point"
import { EnvironmentType } from "@domain/environment"

export interface GetEntryPoint {
	execute(projectId: string, envType: EnvironmentType): Promise<EntryPoint | null>
}
