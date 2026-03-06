import { EntryPoint } from "@app/value-objects/entry-point"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { EnvironmentType } from "@jigjoy-ai/spektrum-client"

export type DeployModuleParams = {
	projectId: string
	moduleId: string
	moduleType: "frontend"
	versionControlId: string
	environmentType: EnvironmentType
	setAsEntryPoint?: boolean
}

export type DeployModuleUseCase = AuthenticatedUseCase<UserData, DeployModuleParams, EntryPoint>