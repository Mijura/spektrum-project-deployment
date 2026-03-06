import { VersionControlService } from "@app/ports/services/version-control-service"
import { Version } from "@app/value-objects/version"
import { FileArtifacts } from "@app/value-objects/file-artifacts"
import { SpektrumClient } from "@jigjoy-ai/spektrum-client"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export class JigJoyVersionControl implements VersionControlService {
	private readonly spektrumClient: SpektrumClient
	constructor() {
		const jigjoyApiEndpoint = process.env.JIGJOY_API_ENDPOINT as string

		this.spektrumClient = new SpektrumClient(jigjoyApiEndpoint, {
			kind: "internal",
			token: process.env.INTERNAL_SERVICE_TOKEN as string,
		})
	}

	async pull(repositoryId: string, auth: Auth<UserData>): Promise<Version> {
		const response = await this.spektrumClient.versioning.getLatestVersion(repositoryId, auth)

		const version: Version = {
			repositoryId: response.projectHistoryId,
			buildArtifacts: response.buildArtifacts,
			sourceCodeArtifacts: response.sourceCodeArtifacts,
		}

		return version
	}

	async initializeRepository(auth: Auth<UserData>): Promise<string> {
		return await this.spektrumClient.versioning.initializeProjectHistory(auth)
	}

	async push(repositoryId: string, buildArtifacts: FileArtifacts, sourceCodeArtifacts: FileArtifacts, auth: Auth<UserData>): Promise<void> {
		const version = {
			projectHistoryId: repositoryId,
			buildArtifacts: buildArtifacts,
			sourceCodeArtifacts: sourceCodeArtifacts,
		}
		await this.spektrumClient.versioning.saveVersion(version, auth)
	}
}
