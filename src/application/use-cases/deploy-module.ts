import { DeployModule } from "@app/ports/use-cases/deploy-module"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"
import { S3Client } from "@app/ports/services/s3-client"
import { DeploymentTarget } from "@domain/deployment-target"
import { EntryPoint } from "@app/value-objects/entry-point"
import { S3 } from "@domain/service/s3"

export class DeployModuleUseCase implements DeployModule {
	constructor(
		private cloudProfileRepo: CloudProfileRepository,
		private versionControlService: VersionControlService,
		private s3Client: S3Client,
	) {}

	async execute(command: DeployModuleCommand): Promise<EntryPoint> {
		let profile = await this.cloudProfileRepo.getByProjectId(command.projectId)

		// if not exists, lazily create ProjectCloudProfile here
		// TODO: Throw error if profile not exists
		if (!profile) {
			profile = ProjectCloudProfile.create(command.projectId)
		}

		const env = profile.getEnvironment(command.environmentType)
		if (!env) throw new Error("Environment not found")

		let deploymentTarget: DeploymentTarget | undefined = env.getDeploymentTarget(command.moduleId)
		const bucket = process.env.WEB_HOSTING_BUCKET as string
		if (!deploymentTarget) {
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
		const revisionId = deploymentTarget.getRevisionId()
		const projectArtifacts = await this.versionControlService.pull(revisionId)
		await this.s3Client.upload(bucket, deploymentTarget.getFolderName(), projectArtifacts.buildArtifacts)
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
