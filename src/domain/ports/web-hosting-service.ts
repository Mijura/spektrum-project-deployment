import { FileArtifacts } from "@jigjoy-io/file-artifacts"


export interface WebHostingService {
    deployPrebuiltCode(projectId: string, buildArtifact: FileArtifacts): Promise<string>
}