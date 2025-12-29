import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"
import { EntryPoint } from "@app/value-objects/entry-point"

export interface DeployModule {
    execute(command: DeployModuleCommand): Promise<EntryPoint>
}