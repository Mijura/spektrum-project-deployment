import { DeployModule } from "@app/ports/inbound/deploy-module"
import { CloudProfileRepository } from "@app/ports/outbound/project-cloud-profile-repository"
import { StaticWebsiteHosting } from "@app/ports/outbound/static-website-hosting"
import { S3StaticWebApp } from "@domain/value-objects/target-service"

export class DeployModuleUseCase implements DeployModule {

    constructor(private cloudProfileRepo: CloudProfileRepository, private hostingService: StaticWebsiteHosting){}

    async execute(deployModuleDTO: DeployModuleCommand): Promise<void> {
        const profile = await this.cloudProfileRepo.getByProjectId(deployModuleDTO.projectId)
        // if not exists, you can lazily create ProjectCloudProfile here
      
        const env = profile.getEnvironment(deployModuleDTO.environmentType)
        if (!env) throw new Error("Environment not found")
      
        // create TargetService from infra info
        const service: S3StaticWebApp = {
			kind: "static-web-app",
			bucketName: "...",
			prefix: "...",
			assetBaseUrl: "...",
			publicAppUrl: "..."
        }

		const deploymentTarget = env.ensureDeploymentTarget(deployModuleDTO.moduleId, service)
      
        if (deployModuleDTO.setAsEntryPoint) {
          env.setEntryPoint(deployModuleDTO.moduleId)
        }

		await this.hostingService.deploy(deploymentTarget)
      
        // persist profile
        await this.cloudProfileRepo.save(profile)
    }
    
}