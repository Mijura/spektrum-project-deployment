import { S3StorageFactory, Storage } from "@jigjoy-io/file-artifacts"
import { StaticWebsiteHosting } from "@app/ports/outbound/static-website-hosting"
import { FileArtifacts } from "@app/value-objects/file-artifacts"

export class S3WebsiteHosting implements StaticWebsiteHosting {

    s3Storage: Storage

    constructor(
        readonly bucket: string
    ) {
        const factory = new S3StorageFactory(bucket)
        this.s3Storage = factory.create()
    }

    async deploy(folderName: string, buildArtifacts: FileArtifacts): Promise<string> {

        await this.s3Storage.writeAll(folderName, buildArtifacts)
        const endpoint = `https://${folderName}.jigjoy.io`
                
        return endpoint
    }


}