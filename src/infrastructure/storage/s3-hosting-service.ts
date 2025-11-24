import { Project, ProjectType } from "@domain/entities/project"
import { Readable } from "stream"
import { EnvironmentType } from "@domain/value-objects/environment"
import { S3StorageFactory, Storage } from "@jigjoy-io/file-artifacts"
import { StaticWebsiteHosting } from "@app/ports/static-website-hosting"

export class S3WebsiteHosting implements StaticWebsiteHosting {

    s3Storage: Storage

    constructor(
        readonly bucket: string
    ) {
        const factory = new S3StorageFactory(bucket)
        this.s3Storage = factory.create()
    }

    deployToEnvironment(project: Project, environment: EnvironmentType): Promise<string> {
        throw new Error("Method not implemented.")
    }

    async deploy(project: Project): Promise<string> {

        if(project.type !== ProjectType.FRONTEND) 
            throw new Error('Required project type for static hosting is FRONTEND')

        const domain = process.env.DOMAIN

        if (!domain) throw new Error('Missing WEB_HOSTING_DOMAIN env variable')
            

        for (const [fileName, content] of Object.entries(buildArtifact)) {
            const stream = Readable.from([content])
            const key = `${projectId}/${fileName}`
            await this.fileStorage.upload(bucket, key, stream)
        }
        
        const endpoint = `https://${projectId}.${domain}`
                
        return endpoint
    }

}