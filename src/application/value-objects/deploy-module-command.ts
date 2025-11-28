import { EnvironmentType } from "@domain/value-objects/environment"

export type DeployModuleCommand = {
    projectId: string
    moduleId: string
    versionControlId: string
    environmentType: EnvironmentType
    setAsEntryPoint?: boolean
}