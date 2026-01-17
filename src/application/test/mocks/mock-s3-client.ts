import { S3Client } from "@app/ports/services/s3-client"
import { FileArtifacts } from "@app/value-objects/file-artifacts"

interface UploadRecord {
	bucket: string
	folder: string
	fileArtifacts: FileArtifacts
}

export class MockS3Client implements S3Client {
	private uploads: UploadRecord[] = []

	async upload(bucket: string, folder: string, fileArtifacts: FileArtifacts): Promise<void> {
		this.uploads.push({ bucket, folder, fileArtifacts })
	}

	getUploads(): UploadRecord[] {
		return [...this.uploads]
	}

	getUploadsByBucket(bucket: string): UploadRecord[] {
		return this.uploads.filter((upload) => upload.bucket === bucket)
	}

	getUploadsByFolder(folder: string): UploadRecord[] {
		return this.uploads.filter((upload) => upload.folder === folder)
	}

	clear(): void {
		this.uploads = []
	}
}
