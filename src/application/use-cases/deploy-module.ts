import { DeployModule } from "@app/ports/use-cases/deploy-module"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { StaticWebsiteHosting } from "@app/ports/services/static-website-hosting"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"
import { DeploymentTarget } from "@domain/deployment-target"
import { EntryPoint } from "@app/value-objects/entry-point"
import { S3 } from "@domain/service/s3"

export class DeployModuleUseCase implements DeployModule {
	constructor(
		private cloudProfileRepo: CloudProfileRepository,
		private hostingService: StaticWebsiteHosting,
	) {}

	async execute(command: DeployModuleCommand): Promise<EntryPoint> {
		let profile = await this.cloudProfileRepo.getByProjectId(command.projectId)

		// if not exists, lazily create ProjectCloudProfile here
		if (!profile) {
			profile = ProjectCloudProfile.create(command.projectId)
		}

		const env = profile.getEnvironment(command.environmentType)
		if (!env) throw new Error("Environment not found")

		let deploymentTarget: DeploymentTarget | undefined = env.getDeploymentTarget(command.moduleId)
		if (!deploymentTarget) {
			const bucket = process.env.WEB_HOSTING_BUCKET
			if (!bucket) throw new Error("Missing WEB_HOSTING_BUCKET env variable")

			const service: S3 = S3.create(
				bucket,
				`https://${bucket}.s3.eu-west-1.amazonaws.com`,
				`development.jigjoy.io`,
			)
			deploymentTarget = DeploymentTarget.create(command.moduleId, command.versionControlId, service)
			env.addDeploymentTarget(deploymentTarget)
		}

		if (command.setAsEntryPoint) {
			env.setEntryPoint(command.moduleId)
		}

		console.log("Deploying module: ", deploymentTarget.getModuleId())
		await this.hostingService.deploy(deploymentTarget)
		console.log("Module deployed: ", deploymentTarget.getModuleId())

		profile.updateEnvironment(env)
		console.log("Profile updated: ", profile)

		// persist profile
		await this.cloudProfileRepo.save(profile)

		return {
			moduleId: deploymentTarget.getModuleId(),
			assetBaseUrl: deploymentTarget.getAssetBaseUrl(),
			publicAppUrl: deploymentTarget.getPublicAppUrl(),
		}
	}
}
