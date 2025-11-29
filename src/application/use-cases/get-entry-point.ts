import { GetEntryPoint } from "@app/ports/inbound/get-entry-point"
import { CloudProfileRepository } from "@app/ports/outbound/project-cloud-profile-repository"
import { EnvironmentType } from "@domain/value-objects/environment"

export class GetEntryPointUseCase implements GetEntryPoint {
    
    constructor(readonly cloudProfileRepo: CloudProfileRepository){}

    async execute(projectId: string, envType: EnvironmentType) {
        const cloudProfile = await this.cloudProfileRepo.getByProjectId(projectId)

        const env = cloudProfile.getEnvironment(envType)

        if(!env)
            throw new Error()

        const deploymentTarget = env.getEntryPoint()

        const targetService = deploymentTarget?.getTargetService()

        
    }
    
}