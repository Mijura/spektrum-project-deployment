import { GetEntryPoint } from "@app/ports/use-cases/get-entry-point"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { EntryPointDTO } from "@app/dto/entry-point"
import { EnvironmentType } from "@domain/environment"

export class GetEntryPointUseCase implements GetEntryPoint {
	constructor(readonly cloudProfileRepo: CloudProfileRepository) {}

	async execute(projectId: string, envType: EnvironmentType): Promise<EntryPointDTO | undefined> {
		const cloudProfile = await this.cloudProfileRepo.getByProjectId(projectId)

		if (!cloudProfile) {
			throw new Error(`ProjectCloudProfile with projectId ${projectId} not found`)
		}

		const env = cloudProfile.getEnvironment(envType)

		if (!env) throw new Error("Environment doesnt exist")

		console.log("cloud profile", cloudProfile)

		const deploymentTarget = env.getEntryPoint()

		if(deploymentTarget) {
			return {
				moduleId: deploymentTarget.getModuleId(),
				assetBaseUrl: deploymentTarget.getAssetBaseUrl(),
				publicAppUrl: deploymentTarget.getPublicAppUrl(),
			}
		}

		return undefined
	}
}
