import { FileArtifacts } from "@app/value-objects/file-artifacts"

export interface StaticWebsiteHosting {
    deploy(folderName: string, buildArtifacts: FileArtifacts): Promise<string>
}