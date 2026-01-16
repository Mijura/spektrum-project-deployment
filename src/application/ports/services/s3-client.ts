import { FileArtifacts } from "@app/value-objects/file-artifacts"

export interface S3Client {
	upload(bucket: string, folder: string, fileArtifacts: FileArtifacts): Promise<void>
}
