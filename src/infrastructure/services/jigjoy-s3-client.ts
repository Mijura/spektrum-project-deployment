import { S3Client } from "@app/ports/services/s3-client"
import { FileArtifacts } from "@app/value-objects/file-artifacts"
import { S3StorageFactory } from "@jigjoy-ai/file-artifacts"

export class JigJoyS3Client implements S3Client {

	async deleteFolder(bucket: string, folder: string): Promise<void> {
		const factory = new S3StorageFactory(bucket)
		const s3Storage = factory.create()
		await s3Storage.deleteFolder(folder)
	}

	async upload(bucket: string, folder: string, fileArtifacts: FileArtifacts): Promise<void> {
		const factory = new S3StorageFactory(bucket)
		const s3Storage = factory.create()
		await s3Storage.writeAll(folder, fileArtifacts)
	}
}
