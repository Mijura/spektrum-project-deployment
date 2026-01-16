import { describe, it, expect } from "@rstest/core"
import { DeploymentTarget } from "@domain/deployment-target"
import { S3 } from "@domain/service/s3"

describe("DeploymentTarget", () => {
	describe("create", () => {
		it("should create a deployment target with module id, revision id, and service", () => {
			const moduleId = "module-123"
			const revisionId = "rev-456"
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")

			const target = DeploymentTarget.create(moduleId, revisionId, service)

			expect(target.getModuleId()).toBe(moduleId)
			expect(target.getRevisionId()).toBe(revisionId)
			expect(target.getService()).toBe(service)
			expect(target.getFolderName()).toBeDefined()
			expect(target.getFolderName().length).toBeGreaterThan(0)
		})

		it("should generate a unique folder name for each deployment target", () => {
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")
			const target1 = DeploymentTarget.create("module-1", "rev-1", service)
			const target2 = DeploymentTarget.create("module-2", "rev-2", service)

			expect(target1.getFolderName()).not.toBe(target2.getFolderName())
		})
	})

	describe("rehydrate", () => {
		it("should rehydrate a deployment target from existing data", () => {
			const moduleId = "module-123"
			const revisionId = "rev-456"
			const folderName = "existing-folder"
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")

			const target = DeploymentTarget.rehydrate({
				moduleId,
				revisionId,
				folderName,
				service,
			})

			expect(target.getModuleId()).toBe(moduleId)
			expect(target.getRevisionId()).toBe(revisionId)
			expect(target.getFolderName()).toBe(folderName)
			expect(target.getService()).toBe(service)
		})
	})

	describe("updateService", () => {
		it("should update the service of the deployment target", () => {
			const service1 = S3.create("bucket-1", "https://bucket-1.s3.amazonaws.com", "d1111111111.cloudfront.net")
			const target = DeploymentTarget.create("module-1", "rev-1", service1)

			const service2 = S3.create("bucket-2", "https://bucket-2.s3.amazonaws.com", "d2222222222.cloudfront.net")
			target.updateService(service2)

			expect(target.getService()).toBe(service2)
			expect(target.getService().bucketName).toBe("bucket-2")
		})
	})

	describe("getPublicAppUrl", () => {
		it("should return the public app URL using CloudFront domain", () => {
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")
			const target = DeploymentTarget.rehydrate({
				moduleId: "module-1",
				revisionId: "rev-1",
				folderName: "my-folder",
				service,
			})

			const url = target.getPublicAppUrl()

			expect(url).toBe("https://my-folder.d1234567890.cloudfront.net")
		})
	})

	describe("getAssetBaseUrl", () => {
		it("should return the asset base URL using bucket website endpoint and folder name", () => {
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")
			const target = DeploymentTarget.rehydrate({
				moduleId: "module-1",
				revisionId: "rev-1",
				folderName: "my-folder",
				service,
			})

			const url = target.getAssetBaseUrl()

			expect(url).toBe("https://my-bucket.s3.amazonaws.com/my-folder")
		})
	})

	describe("getModuleId", () => {
		it("should return the module id", () => {
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")
			const target = DeploymentTarget.create("module-123", "rev-456", service)

			expect(target.getModuleId()).toBe("module-123")
		})
	})

	describe("getRevisionId", () => {
		it("should return the revision id", () => {
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")
			const target = DeploymentTarget.create("module-123", "rev-456", service)

			expect(target.getRevisionId()).toBe("rev-456")
		})
	})

	describe("getFolderName", () => {
		it("should return the folder name", () => {
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")
			const folderName = "custom-folder"
			const target = DeploymentTarget.rehydrate({
				moduleId: "module-1",
				revisionId: "rev-1",
				folderName,
				service,
			})

			expect(target.getFolderName()).toBe(folderName)
		})
	})

	describe("getService", () => {
		it("should return the service", () => {
			const service = S3.create("my-bucket", "https://my-bucket.s3.amazonaws.com", "d1234567890.cloudfront.net")
			const target = DeploymentTarget.create("module-123", "rev-456", service)

			expect(target.getService()).toBe(service)
			expect(target.getService().type).toBeDefined()
		})
	})
})
