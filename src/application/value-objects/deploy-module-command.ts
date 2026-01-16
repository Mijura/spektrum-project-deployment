import { EnvironmentType } from "@domain/environment"

export type DeployModuleCommand = {
	projectId: string
	moduleId: string
	moduleType: "frontend"
	versionControlId: string
	environmentType: EnvironmentType
	setAsEntryPoint?: boolean
}
