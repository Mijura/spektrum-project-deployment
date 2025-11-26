import { DeployToDev } from "@app/ports/inbound/deploy-to-dev"

export class DeployToDevUseCase implements DeployToDev {

    execute(versionControlId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    
}