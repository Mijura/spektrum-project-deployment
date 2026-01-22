import { describe, it, expect, beforeAll, afterAll } from "@rstest/core"
import { JigJoyS3Client } from "@infra/services/jigjoy-s3-client"
import { FileArtifacts } from "@app/value-objects/file-artifacts"

describe("JigJoyS3Client Integration Tests", () => {
	let client: JigJoyS3Client
	const testBucket = process.env.WEB_HOSTING_BUCKET as string
	const testFolder = `test-folder-${Date.now()}`

	beforeAll(() => {
		client = new JigJoyS3Client()
	})

	afterAll(async () => {
		await client.deleteFolder(testBucket, testFolder)
	}, 5_000)

	it("should upload file artifacts to S3", async () => {
		const fileArtifacts: FileArtifacts = {
			"index.html": "<html><body>Test</body></html>",
			"app.js": "console.log('test');",
		}

		await expect(
			client.upload(testBucket, testFolder, fileArtifacts),
		).resolves.not.toThrow()
	}, 5_000)

	it("should upload empty file artifacts to S3", async () => {
		const fileArtifacts: FileArtifacts = {}

		await expect(
			client.upload(testBucket, testFolder, fileArtifacts),
		).resolves.not.toThrow()
	}, 5_000)
})
