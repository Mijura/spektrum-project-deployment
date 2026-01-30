import { VersionControlService } from "@app/ports/services/version-control-service"
import { Version } from "@app/value-objects/version"
import { FileArtifacts } from "@app/value-objects/file-artifacts"
import { PlatformSDK } from "@jigjoy-io/platform-sdk"

export class JigJoyVersionControl implements VersionControlService {
	private readonly jigjoyClient: PlatformSDK
	constructor() {
		const jigjoyApiEndpoint = process.env.JIGJOY_API_ENDPOINT as string

		this.jigjoyClient = new PlatformSDK(jigjoyApiEndpoint)
	}

	async pull(repositoryId: string): Promise<Version> {
		const response = await this.jigjoyClient.versioning.getLatestVersion(repositoryId)

		const version: Version = {
			repositoryId: response.projectHistoryId,
			buildArtifacts: response.buildArtifacts,
			sourceCodeArtifacts: response.sourceCodeArtifacts,
		}

		return version
	}

	async initializeRepository(): Promise<string> {
		return await this.jigjoyClient.versioning.initializeProjectHistory()
	}

	async push(repositoryId: string, buildArtifacts: FileArtifacts, sourceCodeArtifacts: FileArtifacts): Promise<void> {
		const version = {
			projectHistoryId: repositoryId,
			buildArtifacts: buildArtifacts,
			sourceCodeArtifacts: sourceCodeArtifacts,
		}
		await this.jigjoyClient.versioning.saveVersion(version)
	}
}
