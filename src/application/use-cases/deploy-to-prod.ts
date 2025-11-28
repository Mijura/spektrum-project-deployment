import { DeployToProd } from "@app/ports/inbound/deploy-to-prod"

export class DeployToProdUseCase implements DeployToProd {

    execute(moduleId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    
}