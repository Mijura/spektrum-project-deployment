import { GetEntryPoint } from "@app/ports/use-cases/get-entry-point"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { EntryPointDTO } from "@app/dto/entry-point"
import { EnvironmentType } from "@domain/environment"
import { S3 } from "@domain/target-service"

export class GetEntryPointUseCase implements GetEntryPoint {
    
    constructor(readonly cloudProfileRepo: CloudProfileRepository){}

    async execute(projectId: string, envType: EnvironmentType): Promise<EntryPointDTO> {
        const cloudProfile = await this.cloudProfileRepo.getByProjectId(projectId)

        if (!cloudProfile) {
            throw new Error(`ProjectCloudProfile with projectId ${projectId} not found`)
        }

        const env = cloudProfile.getEnvironment(envType)

        if(!env)
            throw new Error('Environment doesnt exist')

        console.log('cloud profile', cloudProfile)

        const deploymentTarget = env.getEntryPoint()

        if(!deploymentTarget)
            throw new Error('Entry point is not set')

        const targetService = deploymentTarget.getTargetService() as S3

        return {
            moduleId: deploymentTarget.getModuleId(),
            assetBaseUrl: targetService.assetBaseUrl,
            publicAppUrl: targetService.publicAppUrl
        }
    }
    
}