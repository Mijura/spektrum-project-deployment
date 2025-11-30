import { EnvironmentType } from "@domain/value-objects/environment"

export type DeployModuleCommand = {
    projectId: string
    moduleId: string
    moduleType: "frontend"
    versionControlId: string
    environmentType: EnvironmentType
    setAsEntryPoint?: boolean
}