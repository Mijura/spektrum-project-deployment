import { VersionControlService } from "@app/ports/services/version-control-service"
import { ProjectVersioningClient } from "@jigjoy-io/project-versioning-client"
import { Version } from "@app/value-objects/version"
import { FileArtifacts } from "@app/value-objects/file-artifacts"

export class JigJoyVersionControl implements VersionControlService {
	private readonly projectVersioning: ProjectVersioningClient
	constructor() {
		const projectVersioningEndpoint = process.env.PROJECT_VERSIONING_ENDPOINT as string

		this.projectVersioning = new ProjectVersioningClient(projectVersioningEndpoint)
	}

	async pull(repositoryId: string): Promise<Version> {
		const response = await this.projectVersioning.getLatestVersion(repositoryId)

		const version: Version = {
			repositoryId: response.projectHistoryId,
			buildArtifacts: response.buildArtifacts,
			sourceCodeArtifacts: response.sourceCodeArtifacts,
		}

		return version
	}

	async initializeRepository(): Promise<string> {
		return await this.projectVersioning.initializeProjectHistory()
	}

	async push(repositoryId: string, buildArtifacts: FileArtifacts, sourceCodeArtifacts: FileArtifacts): Promise<void> {
		const version = {
			projectHistoryId: repositoryId,
			buildArtifacts: buildArtifacts,
			sourceCodeArtifacts: sourceCodeArtifacts,
		}
		await this.projectVersioning.saveVersion(version)
	}
}
