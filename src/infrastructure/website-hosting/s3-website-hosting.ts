import { S3StorageFactory } from "@jigjoy-io/file-artifacts"
import { StaticWebsiteHosting } from "@app/ports/services/static-website-hosting"
import { DeploymentTarget } from "@domain/deployment-target"
import { ProjectVersioningClient } from "@jigjoy-io/project-versioning-client"
import { S3 } from "@domain/service/s3"

export class S3WebsiteHosting implements StaticWebsiteHosting {
	constructor(readonly projectVersioningClient: ProjectVersioningClient) {}

	async deploy(target: DeploymentTarget): Promise<void> {
		const revisionId = target.getRevisionId()
		console.log(`Deploying target module ${JSON.stringify(target)}`)

		const projectArtifacts = await this.projectVersioningClient.getLatestVersion(revisionId)

		const service: S3 = target.getService()

		const factory = new S3StorageFactory(service.bucketName)
		const s3Storage = factory.create()
		await s3Storage.writeAll(target.getFolderName(), projectArtifacts.buildArtifacts)
	}
}
