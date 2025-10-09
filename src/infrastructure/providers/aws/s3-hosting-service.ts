import { FileArtifacts } from "@jigjoy-io/file-artifacts"
import { FileStorage } from "@jigjoy-io/file-artifacts"
import { WebHostingService } from "@domain/ports/web-hosting-service"
import { Readable } from "stream"

export class S3HostingService implements WebHostingService {
    constructor(
        private readonly fileStorage: FileStorage
    ) {}

    async deployPrebuiltCode(projectId: string, buildArtifact: FileArtifacts): Promise<string> {
        const domain = process.env.WEB_HOSTING_DOMAIN
        const bucket = process.env.WEB_HOSTING_BUCKET

        if (!domain) throw new Error('Missing WEB_HOSTING_DOMAIN env variable')
            
        if (!bucket) throw new Error('Missing WEB_HOSTING_BUCKET env variable')

        for (const [fileName, content] of Object.entries(buildArtifact)) {
            const stream = Readable.from([content])
            const key = `${projectId}/${fileName}`
            await this.fileStorage.upload(bucket, key, stream)
        }
                
                
        return `https://${projectId}.${domain}`      
    }

}