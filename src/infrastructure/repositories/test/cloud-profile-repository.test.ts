import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBCloudProfileRepository } from "@infra/repositories/cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { EnvironmentType } from "@domain/environment"
import { DeploymentTarget } from "@domain/deployment-target"
import { S3 } from "@domain/service/s3"

describe("DynamoDB Cloud Profile Repository", () => {
	let repository: DynamoDBCloudProfileRepository
	let ddbDocClient: DynamoDBDocumentClient
	const testProjectIds: string[] = []

	const client = new DynamoDBClient({
		region: process.env.AWS_REGION,
		profile: process.env.AWS_PROFILE,
	})

	beforeEach(() => {
		ddbDocClient = DynamoDBDocumentClient.from(client)
		repository = new DynamoDBCloudProfileRepository()
	})

	afterEach(async () => {
		// Clean up test data from DynamoDB
		const tableName = process.env.PROJECT_CLOUD_PROFILE
		if (!tableName) return

		for (const id of testProjectIds) {
			try {
				await ddbDocClient.send(
					new DeleteCommand({
						TableName: tableName,
						Key: {
							projectId: id,
						},
					}),
				)
			} catch (error) {
				console.error(`Failed to delete test data with projectId ${id}:`, error)
			}
		}
		testProjectIds.length = 0
	})

	it("should save a cloud profile to DynamoDB", async () => {
		const projectId = "test-project-123"
		const profile = ProjectCloudProfile.create(projectId)
		testProjectIds.push(projectId)

		await repository.save(profile)

		const retrieved = await repository.getByProjectId(projectId)

		expect(retrieved).toBeDefined()
		expect(retrieved?.projectId).toBe(projectId)
		expect(retrieved?.getEnvironments()).toHaveLength(2)
		expect(retrieved?.getEnvironment(EnvironmentType.DEV)).toBeDefined()
		expect(retrieved?.getEnvironment(EnvironmentType.PROD)).toBeDefined()
	})

	it("should retrieve a previously saved profile from DynamoDB", async () => {
		const projectId = "test-project-456"
		const profile = ProjectCloudProfile.create(projectId)
		testProjectIds.push(projectId)

		await repository.save(profile)

		const retrieved = await repository.getByProjectId(projectId)

		expect(retrieved).toBeDefined()
		expect(retrieved?.projectId).toBe(projectId)
		expect(retrieved?.getEnvironments()).toHaveLength(2)

		const devEnv = retrieved?.getEnvironment(EnvironmentType.DEV)
		const prodEnv = retrieved?.getEnvironment(EnvironmentType.PROD)

		expect(devEnv).toBeDefined()
		expect(prodEnv).toBeDefined()
		expect(devEnv?.getType()).toBe(EnvironmentType.DEV)
		expect(prodEnv?.getType()).toBe(EnvironmentType.PROD)
	})

	it("should return undefined when retrieving a non-existent profile", async () => {
		const nonExistentProjectId = "non-existent-project-id"

		const retrieved = await repository.getByProjectId(nonExistentProjectId)

		expect(retrieved).toBeUndefined()
	})

	it("should save and retrieve a profile with deployment targets", async () => {
		const projectId = "test-project-with-targets"
		const profile = ProjectCloudProfile.create(projectId)
		const devEnv = profile.getEnvironment(EnvironmentType.DEV)

		const service = S3.create(
			"test-bucket",
			"https://test-bucket.s3.eu-west-1.amazonaws.com",
			"development.jigjoy.io",
		)
		const deploymentTarget = DeploymentTarget.create("module-123", "revision-456", service)
		devEnv?.addDeploymentTarget(deploymentTarget)
		devEnv?.setEntryPoint("module-123")
		profile.updateEnvironment(devEnv!)

		testProjectIds.push(projectId)

		await repository.save(profile)

		const retrieved = await repository.getByProjectId(projectId)

		expect(retrieved).toBeDefined()
		const retrievedDevEnv = retrieved?.getEnvironment(EnvironmentType.DEV)
		const retrievedTarget = retrievedDevEnv?.getDeploymentTarget("module-123")
		const entryPoint = retrievedDevEnv?.getEntryPoint()

		expect(retrievedTarget).toBeDefined()
		expect(retrievedTarget?.getModuleId()).toBe("module-123")
		expect(retrievedTarget?.getRevisionId()).toBe("revision-456")
		expect(entryPoint).toBeDefined()
		expect(entryPoint?.getModuleId()).toBe("module-123")
	})

	it("should update an existing profile when saving again", async () => {
		const projectId = "test-project-update"
		const profile = ProjectCloudProfile.create(projectId)
		testProjectIds.push(projectId)

		await repository.save(profile)

		// Update the profile by adding a deployment target
		const devEnv = profile.getEnvironment(EnvironmentType.DEV)
		const service = S3.create(
			"test-bucket",
			"https://test-bucket.s3.eu-west-1.amazonaws.com",
			"development.jigjoy.io",
		)
		const deploymentTarget = DeploymentTarget.create("module-updated", "revision-updated", service)
		devEnv?.addDeploymentTarget(deploymentTarget)
		profile.updateEnvironment(devEnv!)

		await repository.save(profile)

		const retrieved = await repository.getByProjectId(projectId)
		const retrievedDevEnv = retrieved?.getEnvironment(EnvironmentType.DEV)
		const retrievedTarget = retrievedDevEnv?.getDeploymentTarget("module-updated")

		expect(retrievedTarget).toBeDefined()
		expect(retrievedTarget?.getModuleId()).toBe("module-updated")
		expect(retrievedTarget?.getRevisionId()).toBe("revision-updated")
	})

	it("should save and retrieve a profile with multiple deployment targets", async () => {
		const projectId = "test-project-multiple-targets"
		const profile = ProjectCloudProfile.create(projectId)
		const devEnv = profile.getEnvironment(EnvironmentType.DEV)

		const service = S3.create(
			"test-bucket",
			"https://test-bucket.s3.eu-west-1.amazonaws.com",
			"development.jigjoy.io",
		)
		const target1 = DeploymentTarget.create("module-1", "revision-1", service)
		const target2 = DeploymentTarget.create("module-2", "revision-2", service)
		devEnv?.addDeploymentTarget(target1)
		devEnv?.addDeploymentTarget(target2)
		devEnv?.setEntryPoint("module-1")
		profile.updateEnvironment(devEnv!)

		testProjectIds.push(projectId)

		await repository.save(profile)

		const retrieved = await repository.getByProjectId(projectId)
		const retrievedDevEnv = retrieved?.getEnvironment(EnvironmentType.DEV)

		expect(retrievedDevEnv?.deploymentTargets).toHaveLength(2)
		expect(retrievedDevEnv?.getDeploymentTarget("module-1")).toBeDefined()
		expect(retrievedDevEnv?.getDeploymentTarget("module-2")).toBeDefined()
		expect(retrievedDevEnv?.getEntryPoint()?.getModuleId()).toBe("module-1")
	})

	it("should save and retrieve a profile with environments in both DEV and PROD", async () => {
		const projectId = "test-project-both-envs"
		const profile = ProjectCloudProfile.create(projectId)
		const devEnv = profile.getEnvironment(EnvironmentType.DEV)
		const prodEnv = profile.getEnvironment(EnvironmentType.PROD)

		const service = S3.create(
			"test-bucket",
			"https://test-bucket.s3.eu-west-1.amazonaws.com",
			"development.jigjoy.io",
		)
		const devTarget = DeploymentTarget.create("dev-module", "dev-revision", service)
		const prodTarget = DeploymentTarget.create("prod-module", "prod-revision", service)

		devEnv?.addDeploymentTarget(devTarget)
		prodEnv?.addDeploymentTarget(prodTarget)
		devEnv?.setEntryPoint("dev-module")
		prodEnv?.setEntryPoint("prod-module")

		profile.updateEnvironment(devEnv!)
		profile.updateEnvironment(prodEnv!)

		testProjectIds.push(projectId)

		await repository.save(profile)

		const retrieved = await repository.getByProjectId(projectId)

		const retrievedDevEnv = retrieved?.getEnvironment(EnvironmentType.DEV)
		const retrievedProdEnv = retrieved?.getEnvironment(EnvironmentType.PROD)

		expect(retrievedDevEnv?.getDeploymentTarget("dev-module")).toBeDefined()
		expect(retrievedProdEnv?.getDeploymentTarget("prod-module")).toBeDefined()
		expect(retrievedDevEnv?.getEntryPoint()?.getModuleId()).toBe("dev-module")
		expect(retrievedProdEnv?.getEntryPoint()?.getModuleId()).toBe("prod-module")
	})

	it("should throw an error when DynamoDB get operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.PROJECT_CLOUD_PROFILE
		process.env.PROJECT_CLOUD_PROFILE = ""

		try {
			await expect(repository.getByProjectId("some-project-id")).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.PROJECT_CLOUD_PROFILE = originalTableName
			} else {
				delete process.env.PROJECT_CLOUD_PROFILE
			}
		}
	})

	it("should throw an error when DynamoDB save operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.PROJECT_CLOUD_PROFILE
		process.env.PROJECT_CLOUD_PROFILE = ""

		const profile = ProjectCloudProfile.create("test-project-id")
		// Note: Not tracking for cleanup since save will fail and nothing will be written to DynamoDB

		try {
			await expect(repository.save(profile)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.PROJECT_CLOUD_PROFILE = originalTableName
			} else {
				delete process.env.PROJECT_CLOUD_PROFILE
			}
		}
	})

	it("should save and retrieve a profile with updated environment", async () => {
		const projectId = "test-project-env-update"
		const profile = ProjectCloudProfile.create(projectId)
		testProjectIds.push(projectId)

		await repository.save(profile)

		// Update environment with deployment target
		const devEnv = profile.getEnvironment(EnvironmentType.DEV)
		const service = S3.create(
			"test-bucket",
			"https://test-bucket.s3.eu-west-1.amazonaws.com",
			"development.jigjoy.io",
		)
		const deploymentTarget = DeploymentTarget.create("module-new", "revision-new", service)
		devEnv?.addDeploymentTarget(deploymentTarget)
		profile.updateEnvironment(devEnv!)

		await repository.save(profile)

		const retrieved = await repository.getByProjectId(projectId)
		const retrievedDevEnv = retrieved?.getEnvironment(EnvironmentType.DEV)
		const retrievedTarget = retrievedDevEnv?.getDeploymentTarget("module-new")

		expect(retrievedTarget).toBeDefined()
		expect(retrievedTarget?.getModuleId()).toBe("module-new")
	})
})
