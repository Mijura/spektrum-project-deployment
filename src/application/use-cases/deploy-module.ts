import { DeployModule } from "@app/ports/use-cases/deploy-module"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { StaticWebsiteHosting } from "@app/ports/services/static-website-hosting"
import { DeployModuleDTO } from "@app/dto/deploy-module"
import { EntryPointDTO } from "@app/dto/entry-point"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { S3 } from "@domain/target-service"

export class DeployModuleUseCase implements DeployModule {

    constructor(private cloudProfileRepo: CloudProfileRepository, private hostingService: StaticWebsiteHosting){}

    async execute(deployModuleDTO: DeployModuleDTO): Promise<EntryPointDTO> {
        let profile = await this.cloudProfileRepo.getByProjectId(deployModuleDTO.projectId)
        
        // if not exists, lazily create ProjectCloudProfile here
        if (!profile) {
            profile = ProjectCloudProfile.create(deployModuleDTO.projectId)
        }
      
        const env = profile.getEnvironment(deployModuleDTO.environmentType)
        if (!env) 
            throw new Error("Environment not found")


        const bucket = process.env.WEB_HOSTING_BUCKET
        if (!bucket) 
            throw new Error("Missing WEB_HOSTING_BUCKET env variable")

        // create TargetService from infra info
        const service: S3 = {
            type: 's3',
			kind: "static-web-app",
			bucketName: bucket,
			prefix: `${deployModuleDTO.projectId}`,
			assetBaseUrl: `https://jigjoy-web-hosting.s3.eu-west-1.amazonaws.com/${deployModuleDTO.projectId}`,
			publicAppUrl: `https://${deployModuleDTO.projectId}.development.jigjoy.io`
        }

		const deploymentTarget = env.ensureDeploymentTarget(deployModuleDTO.moduleId, deployModuleDTO.versionControlId, service)
      
        if (deployModuleDTO.setAsEntryPoint) {
          	env.setEntryPoint(deployModuleDTO.moduleId)
        }

		await this.hostingService.deploy(deploymentTarget)

        env.addDeploymentTarget(deploymentTarget)
        profile.updateEnvironment(env)

        console.log('profile', profile)
      
        // persist profile
        await this.cloudProfileRepo.save(profile)

        return {
            moduleId: deploymentTarget.getModuleId(),
            assetBaseUrl: service.assetBaseUrl,
            publicAppUrl: service.publicAppUrl
        }
    }
    
}