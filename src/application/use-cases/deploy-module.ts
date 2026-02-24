import { DeployModuleParams, DeployModuleUseCase } from "@app/ports/use-cases/deploy-module"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { S3Client } from "@app/ports/services/s3-client"
import { DeploymentTarget } from "@domain/deployment-target"
import { EntryPoint } from "@app/value-objects/entry-point"
import { S3 } from "@domain/service/s3"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export class DeployModule implements DeployModuleUseCase {
	constructor(
		private cloudProfileRepo: CloudProfileRepository,
		private versionControlService: VersionControlService,
		private s3Client: S3Client,
	) {}

	async execute(auth: Auth<UserData>, params: DeployModuleParams): Promise<EntryPoint> {

		const { projectId, moduleId, moduleType, versionControlId, environmentType, setAsEntryPoint } = params
		let profile = await this.cloudProfileRepo.getByProjectId(projectId)

		// if not exists, lazily create ProjectCloudProfile here
		// TODO: Throw error if profile not exists
		if (!profile) {
			profile = ProjectCloudProfile.create(projectId)
		}

		const env = profile.getEnvironment(environmentType)
		if (!env) throw new Error("Environment not found")

		let deploymentTarget: DeploymentTarget | undefined = env.getDeploymentTarget(moduleId)
		const bucket = process.env.WEB_HOSTING_BUCKET as string
		const appsDomain = process.env.APPS_DOMAIN_SUFFIX as string
		const region = process.env.AWS_REGION || "eu-west-1"
		if (!deploymentTarget) {
			const service: S3 = S3.create(
				bucket,
				`http://${bucket}.s3-website-${region}.amazonaws.com`,
				appsDomain,
			)
			deploymentTarget = DeploymentTarget.create(moduleId, versionControlId, service)
			env.addDeploymentTarget(deploymentTarget)
		}

		if (setAsEntryPoint) {
			env.setEntryPoint(moduleId)
		}

		console.log("Deploying module: ", deploymentTarget.getModuleId())
		const revisionId = deploymentTarget.getRevisionId()
		const projectArtifacts = await this.versionControlService.pull(revisionId, auth)
		
		// delete the folder before uploading new artifacts
		await this.s3Client.deleteFolder(bucket, deploymentTarget.getFolderName())
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
