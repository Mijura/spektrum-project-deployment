import { S3StorageFactory } from "@jigjoy-io/file-artifacts"
import { StaticWebsiteHosting } from "@app/ports/services/static-website-hosting"
import { DeploymentTarget } from "@domain/deployment-target"
import { ProjectVersioningClient } from "@jigjoy-io/project-versioning-client"
import { S3 } from "@domain/target-service"

export class S3WebsiteHosting implements StaticWebsiteHosting {
	constructor(readonly projectVersioningClient: ProjectVersioningClient) {}

	async deploy(target: DeploymentTarget): Promise<void> {
		const versionControlId = target.getVersionControlId()
		const projectArtifacts = await this.projectVersioningClient.getLatestVersion(versionControlId)

		const service = target.getTargetService() as S3

		const factory = new S3StorageFactory(service.bucketName)
		const s3Storage = factory.create()

		await s3Storage.writeAll(service.prefix, projectArtifacts.buildArtifacts)
	}
}
