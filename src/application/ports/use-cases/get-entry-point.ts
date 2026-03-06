import { EntryPoint } from "@app/value-objects/entry-point"
import { EnvironmentType } from "@domain/environment"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type GetEntryPointParams = {
	projectId: string
	envType: EnvironmentType
}

export type GetEntryPointUseCase = AuthenticatedUseCase<UserData, GetEntryPointParams, EntryPoint | null>