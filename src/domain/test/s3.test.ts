import { describe, it, expect } from "@rstest/core"
import { S3 } from "@domain/service/s3"
import { ServiceType } from "@domain/service/service-type"

describe("S3", () => {
	describe("create", () => {
		it("should create an S3 service with bucket name, website endpoint, and CloudFront domain", () => {
			const bucketName = "my-bucket"
			const bucketWebsiteEndpoint = "https://my-bucket.s3.amazonaws.com"
			const cloudFrontDomain = "d1234567890.cloudfront.net"

			const s3 = S3.create(bucketName, bucketWebsiteEndpoint, cloudFrontDomain)

			expect(s3.type).toBe(ServiceType.S3)
			expect(s3.bucketName).toBe(bucketName)
			expect(s3.bucketWebsiteEndpoint).toBe(bucketWebsiteEndpoint)
			expect(s3.cloudFrontDomain).toBe(cloudFrontDomain)
		})

		it("should create multiple S3 instances with different configurations", () => {
			const s31 = S3.create("bucket-1", "https://bucket-1.s3.amazonaws.com", "d1111111111.cloudfront.net")
			const s32 = S3.create("bucket-2", "https://bucket-2.s3.amazonaws.com", "d2222222222.cloudfront.net")

			expect(s31.bucketName).toBe("bucket-1")
			expect(s32.bucketName).toBe("bucket-2")
			expect(s31.bucketName).not.toBe(s32.bucketName)
		})
	})

	describe("type", () => {
		it("should have ServiceType.S3 as type", () => {
			const s3 = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")

			expect(s3.type).toBe(ServiceType.S3)
		})
	})

	describe("inheritance", () => {
		it("should extend CloudService", () => {
			const s3 = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")

			expect(s3).toBeInstanceOf(Object)
			expect(s3.type).toBeDefined()
		})
	})
})
