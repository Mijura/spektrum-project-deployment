import { DeployModuleCommand } from "@app/dto/deploy-module"
import { EntryPoint } from "@app/dto/entry-point"

export interface DeployModule {
	execute(command: DeployModuleCommand): Promise<EntryPoint>
}
