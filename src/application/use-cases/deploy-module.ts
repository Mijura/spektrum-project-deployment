import { DeployModule } from "@app/ports/inbound/deploy-module"
import { CloudProfileRepository } from "@app/ports/outbound/project-cloud-profile-repository"
import { StaticWebsiteHosting } from "@app/ports/outbound/static-website-hosting"
import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"
import { S3 } from "@domain/value-objects/target-service"

export class DeployModuleUseCase implements DeployModule {

    constructor(private cloudProfileRepo: CloudProfileRepository, private hostingService: StaticWebsiteHosting){}

    async execute(command: DeployModuleCommand): Promise<void> {
        const profile = await this.cloudProfileRepo.getByProjectId(command.projectId)
        // if not exists, you can lazily create ProjectCloudProfile here
      
        const env = profile.getEnvironment(command.environmentType)
        if (!env) throw new Error("Environment not found")

		
      
        // create TargetService from infra info
        const service: S3 = {
			kind: "static-web-app",
			bucketName: "...",
			prefix: "...",
			assetBaseUrl: "...",
			publicAppUrl: "..."
        }

		const deploymentTarget = env.ensureDeploymentTarget(command.moduleId, command.versionControlId, service)
      
        if (command.setAsEntryPoint) {
          env.setEntryPoint(command.moduleId)
        }

		await this.hostingService.deploy(deploymentTarget)
      
        // persist profile
        await this.cloudProfileRepo.save(profile)
    }
    
}