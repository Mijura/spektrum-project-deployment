import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"

export interface DeployModule {
    execute(command: DeployModuleCommand): Promise<void>
}