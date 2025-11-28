import { S3StorageFactory } from "@jigjoy-io/file-artifacts"
import { StaticWebsiteHosting } from "@app/ports/outbound/static-website-hosting"
import { DeploymentTarget } from "@domain/value-objects/deployment-target"
import { ProjectArtifactsClient } from "@jigjoy-io/project-artifacts-client"
import { S3 } from "@domain/value-objects/target-service"

export class S3WebsiteHosting implements StaticWebsiteHosting {

    constructor(
        readonly projectArtifactsClient: ProjectArtifactsClient
    ) { }

    async deploy(target: DeploymentTarget<S3>): Promise<void> {

        const versionControlId = target.getVersionControlId()
        const projectArtifacts = await this.projectArtifactsClient.fetchArtifacts(versionControlId)

        const service = target.getTargetService()

        const factory = new S3StorageFactory(service.bucketName)
        const s3Storage = factory.create()

        await s3Storage.writeAll(service.prefix, projectArtifacts.buildArtifacts)
                
    }


}