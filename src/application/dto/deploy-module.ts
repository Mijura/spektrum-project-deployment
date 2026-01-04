import { EnvironmentType } from "@domain/environment"

export type DeployModuleDTO = {
	projectId: string
	moduleId: string
	moduleType: "frontend"
	versionControlId: string
	environmentType: EnvironmentType
	setAsEntryPoint?: boolean
}
