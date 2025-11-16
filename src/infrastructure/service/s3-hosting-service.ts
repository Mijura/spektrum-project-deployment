import { Project, ProjectType } from "@domain/entities/project"
import { StaticHostingService } from "@domain/ports/static-hosting-service"
import { Url } from "@domain/value-objects/url"
import { FileStorage } from "@jigjoy-io/file-storage"
import { Readable } from "stream"

export class JigJoyS3HostingService implements StaticHostingService {
    constructor(
        private readonly fileStorage: FileStorage
    ) {}

    async deploy(project: Project): Promise<Url> {

        if(project.type !== ProjectType.FRONTEND) 
            throw new Error('Required project type for static hosting is FRONTEND')

        const domain = process.env.DOMAIN
        const bucket = process.env.WEB_HOSTING_BUCKET

        if (!domain) throw new Error('Missing WEB_HOSTING_DOMAIN env variable')
            
        if (!bucket) throw new Error('Missing WEB_HOSTING_BUCKET env variable')

        for (const [fileName, content] of Object.entries(buildArtifact)) {
            const stream = Readable.from([content])
            const key = `${projectId}/${fileName}`
            await this.fileStorage.upload(bucket, key, stream)
        }
        
        const endpoint = `https://${projectId}.${domain}`
        const url = new Url(endpoint)
                
        return url
    }

}