import { GetEntryPoint } from "@app/ports/inbound/get-entry-point"
import { CloudProfileRepository } from "@app/ports/outbound/project-cloud-profile-repository"
import { EntryPoint } from "@app/value-objects/entry-point"
import { EnvironmentType } from "@domain/value-objects/environment"
import { S3 } from "@domain/value-objects/target-service"

export class GetEntryPointUseCase implements GetEntryPoint {
    
    constructor(readonly cloudProfileRepo: CloudProfileRepository){}

    async execute(projectId: string, envType: EnvironmentType): Promise<EntryPoint> {
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