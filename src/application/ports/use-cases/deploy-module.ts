import { DeployModuleDTO } from "@app/dto/deploy-module"
import { EntryPointDTO } from "@app/dto/entry-point"

export interface DeployModule {
	execute(command: DeployModuleDTO): Promise<EntryPointDTO>
}
