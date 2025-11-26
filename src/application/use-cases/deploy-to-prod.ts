import { DeployToProd } from "@app/ports/inbound/deploy-to-prod"

export class DeployToProdUseCase implements DeployToProd {

    execute(projectHistoryId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    
}