import { describe, it, expect, beforeEach } from "@rstest/core"

import { GetEntryPoint } from "@app/use-cases/get-entry-point"
import { MockCloudProfileRepository } from "@app/test/mocks/mock-cloud-profile-repository"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { EnvironmentType } from "@domain/environment"
import { DeploymentTarget } from "@domain/deployment-target"
import { S3 } from "@domain/service/s3"

describe("GetEntryPoint", () => {
	let getEntryPointUseCase: GetEntryPoint
	let repository: CloudProfileRepository

	beforeEach(() => {
		repository = new MockCloudProfileRepository()
		getEntryPointUseCase = new GetEntryPoint(repository)
	})

	it("should return entry point when it exists", async () => {
		// Arrange
		const projectId = "project-123"
		const moduleId = "module-456"
		const profile = ProjectCloudProfile.create(projectId)
		const env = profile.getEnvironment(EnvironmentType.DEV)
		const service = S3.create(
			"test-bucket",
			"https://test-bucket.s3.eu-west-1.amazonaws.com",
			"development.jigjoy.io",
		)
		const deploymentTarget = DeploymentTarget.create(moduleId, "revision-123", service)
		env?.addDeploymentTarget(deploymentTarget)
		env?.setEntryPoint(moduleId)
		profile.updateEnvironment(env!)
		await repository.save(profile)

		// Act
		const result = await getEntryPointUseCase.execute(projectId, EnvironmentType.DEV)

		// Assert
		expect(result).toBeDefined()
		expect(result).not.toBeNull()
		if (result) {
			expect(result.moduleId).toBe(moduleId)
			expect(result.assetBaseUrl).toBeDefined()
			expect(result.publicAppUrl).toBeDefined()
		}
	})

	it("should return null when entry point is not set", async () => {
		// Arrange
		const projectId = "project-456"
		const moduleId = "module-789"
		const profile = ProjectCloudProfile.create(projectId)
		const env = profile.getEnvironment(EnvironmentType.DEV)
		const service = S3.create(
			"test-bucket",
			"https://test-bucket.s3.eu-west-1.amazonaws.com",
			"development.jigjoy.io",
		)
		const deploymentTarget = DeploymentTarget.create(moduleId, "revision-456", service)
		env?.addDeploymentTarget(deploymentTarget)
		// Don't set entry point
		profile.updateEnvironment(env!)
		await repository.save(profile)

		// Act
		const result = await getEntryPointUseCase.execute(projectId, EnvironmentType.DEV)

		// Assert
		expect(result).toBeNull()
	})

	it("should throw error when project profile does not exist", async () => {
		// Arrange
		const projectId = "non-existent-project"
		const envType = EnvironmentType.DEV

		// Act & Assert
		await expect(getEntryPointUseCase.execute(projectId, envType)).rejects.toThrow(
			`ProjectCloudProfile with projectId ${projectId} not found`,
		)
	})

	it("should return entry point for PROD environment", async () => {
		// Arrange
		const projectId = "project-prod"
		const moduleId = "module-prod"
		const profile = ProjectCloudProfile.create(projectId)
		const env = profile.getEnvironment(EnvironmentType.PROD)
		const service = S3.create(
			"prod-bucket",
			"https://prod-bucket.s3.eu-west-1.amazonaws.com",
			"production.jigjoy.io",
		)
		const deploymentTarget = DeploymentTarget.create(moduleId, "revision-prod", service)
		env?.addDeploymentTarget(deploymentTarget)
		env?.setEntryPoint(moduleId)
		profile.updateEnvironment(env!)
		await repository.save(profile)

		// Act
		const result = await getEntryPointUseCase.execute(projectId, EnvironmentType.PROD)

		// Assert
		expect(result).toBeDefined()
		expect(result).not.toBeNull()
		if (result) {
			expect(result.moduleId).toBe(moduleId)
			expect(result.assetBaseUrl).toContain("prod-bucket")
		}
	})

	it("should return correct URLs for entry point", async () => {
		// Arrange
		const projectId = "project-urls"
		const moduleId = "module-urls"
		const profile = ProjectCloudProfile.create(projectId)
		const env = profile.getEnvironment(EnvironmentType.DEV)
		const bucket = "test-bucket"
		const service = S3.create(bucket, `https://${bucket}.s3.eu-west-1.amazonaws.com`, "development.jigjoy.io")
		const deploymentTarget = DeploymentTarget.create(moduleId, "revision-urls", service)
		env?.addDeploymentTarget(deploymentTarget)
		env?.setEntryPoint(moduleId)
		profile.updateEnvironment(env!)
		await repository.save(profile)

		// Act
		const result = await getEntryPointUseCase.execute(projectId, EnvironmentType.DEV)

		// Assert
		expect(result).toBeDefined()
		expect(result).not.toBeNull()
		if (result) {
			expect(result.assetBaseUrl).toBe(deploymentTarget.getAssetBaseUrl())
			expect(result.publicAppUrl).toBe(deploymentTarget.getPublicAppUrl())
		}
	})

	it("should return null when environment has no deployment targets", async () => {
		// Arrange
		const projectId = "project-empty"
		const profile = ProjectCloudProfile.create(projectId)
		await repository.save(profile)

		// Act
		const result = await getEntryPointUseCase.execute(projectId, EnvironmentType.DEV)

		// Assert
		expect(result).toBeNull()
	})

	it("should throw error when environment does not exist", async () => {
		// Arrange
		const projectId = "project-missing-env"
		// Create a profile rehydrated from DB without the expected environment
		// This simulates a corrupted or incorrectly saved profile
		const profile = ProjectCloudProfile.rehydrate(projectId, [])
		await repository.save(profile)

		// Act & Assert
		await expect(getEntryPointUseCase.execute(projectId, EnvironmentType.DEV)).rejects.toThrow(
			"Environment doesnt exist",
		)
	})
})
