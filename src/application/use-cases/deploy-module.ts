import { DeployModule } from "@app/ports/inbound/deploy-module"
import { CloudProfileRepository } from "@app/ports/outbound/project-cloud-profile-repository"
import { StaticWebsiteHosting } from "@app/ports/outbound/static-website-hosting"
import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"
import { EntryPoint } from "@app/value-objects/entry-point"
import { ProjectCloudProfile } from "@domain/entities/project-cloud-profile"
import { S3 } from "@domain/value-objects/target-service"

export class DeployModuleUseCase implements DeployModule {

    constructor(private cloudProfileRepo: CloudProfileRepository, private hostingService: StaticWebsiteHosting){}

    async execute(command: DeployModuleCommand): Promise<EntryPoint> {
        let profile = await this.cloudProfileRepo.getByProjectId(command.projectId)
        
        // if not exists, lazily create ProjectCloudProfile here
        if (!profile) {
            profile = ProjectCloudProfile.create(command.projectId)
        }
      
        const env = profile.getEnvironment(command.environmentType)
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
			prefix: `${command.projectId}`,
			assetBaseUrl: `https://jigjoy-web-hosting.s3.eu-west-1.amazonaws.com/${command.projectId}`,
			publicAppUrl: `https://${command.projectId}.development.jigjoy.io`
        }

		const deploymentTarget = env.ensureDeploymentTarget(command.moduleId, command.versionControlId, service)
      
        if (command.setAsEntryPoint) {
          	env.setEntryPoint(command.moduleId)
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