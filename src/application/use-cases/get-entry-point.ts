import { GetEntryPointParams, GetEntryPointUseCase } from "@app/ports/use-cases/get-entry-point"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { EntryPoint } from "@app/value-objects/entry-point"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class GetEntryPoint implements GetEntryPointUseCase {
	constructor(readonly cloudProfileRepo: CloudProfileRepository) {}

	async execute(auth: Auth<UserData>, params: GetEntryPointParams): Promise<EntryPoint | null> {

		console.log(`Auth data: ${JSON.stringify(auth)}`)
		const { projectId, envType } = params
		const cloudProfile = await this.cloudProfileRepo.getByProjectId(projectId)

		if (!cloudProfile) {
			throw new Error(`ProjectCloudProfile with projectId ${projectId} not found`)
		}

		const env = cloudProfile.getEnvironment(envType)

		if (!env) throw new Error("Environment doesnt exist")

		console.log("cloud profile", cloudProfile)

		const deploymentTarget = env.getEntryPoint()

		if (deploymentTarget) {
			return {
				moduleId: deploymentTarget.getModuleId(),
				assetBaseUrl: deploymentTarget.getAssetBaseUrl(),
				publicAppUrl: deploymentTarget.getPublicAppUrl(),
			}
		}

		return null
	}
}
