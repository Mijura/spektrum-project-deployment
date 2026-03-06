import { describe, it, expect } from "@rstest/core"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { Environment, EnvironmentType } from "@domain/environment"
import { DeploymentTarget } from "@domain/deployment-target"
import { S3 } from "@domain/service/s3"

describe("ProjectCloudProfile", () => {
	describe("create", () => {
		it("should create a project cloud profile with dev and prod environments", () => {
			const projectId = "project-123"

			const profile = ProjectCloudProfile.create(projectId)

			expect(profile.projectId).toBe(projectId)
			const environments = profile.getEnvironments()
			expect(environments).toHaveLength(2)
			expect(environments.find((env) => env.getType() === EnvironmentType.DEV)).toBeDefined()
			expect(environments.find((env) => env.getType() === EnvironmentType.PROD)).toBeDefined()
		})
	})

	describe("updateEnvironment", () => {
		it("should update an existing environment", () => {
			const projectId = "project-123"
			const profile = ProjectCloudProfile.create(projectId)
			const newDevEnv = Environment.create(EnvironmentType.DEV)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target = DeploymentTarget.create("module-1", "rev-1", service)
			newDevEnv.addDeploymentTarget(target)

			profile.updateEnvironment(newDevEnv)

			const updatedEnv = profile.getEnvironment(EnvironmentType.DEV)
			expect(updatedEnv).toBeDefined()
			expect(updatedEnv?.getDeploymentTarget("module-1")).toBeDefined()
		})

		it("should not update if environment type does not exist", () => {
			const projectId = "project-123"
			// Create a profile with only DEV environment (using rehydrate)
			const devEnv = Environment.create(EnvironmentType.DEV)
			const profile = ProjectCloudProfile.rehydrate(projectId, [devEnv])
			const originalEnvs = profile.getEnvironments()

			// Try to update with PROD environment (which doesn't exist in this profile)
			const prodEnv = Environment.create(EnvironmentType.PROD)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target = DeploymentTarget.create("module-1", "rev-1", service)
			prodEnv.addDeploymentTarget(target)

			profile.updateEnvironment(prodEnv)

			// Verify the profile still only has DEV, and PROD was not added
			const envs = profile.getEnvironments()
			expect(envs).toHaveLength(originalEnvs.length)
			expect(profile.getEnvironment(EnvironmentType.DEV)).toBeDefined()
			expect(profile.getEnvironment(EnvironmentType.PROD)).toBeUndefined()
		})
	})

	describe("rehydrate", () => {
		it("should rehydrate a project cloud profile from existing data", () => {
			const projectId = "project-123"
			const devEnv = Environment.create(EnvironmentType.DEV)
			const prodEnv = Environment.create(EnvironmentType.PROD)

			const profile = ProjectCloudProfile.rehydrate(projectId, [devEnv, prodEnv])

			expect(profile.projectId).toBe(projectId)
			expect(profile.getEnvironments()).toHaveLength(2)
		})
	})

	describe("getEnvironment", () => {
		it("should return the environment for the given type", () => {
			const projectId = "project-123"
			const profile = ProjectCloudProfile.create(projectId)

			const devEnv = profile.getEnvironment(EnvironmentType.DEV)
			const prodEnv = profile.getEnvironment(EnvironmentType.PROD)

			expect(devEnv).toBeDefined()
			expect(devEnv?.getType()).toBe(EnvironmentType.DEV)
			expect(prodEnv).toBeDefined()
			expect(prodEnv?.getType()).toBe(EnvironmentType.PROD)
		})

		it("should return undefined for non-existent environment type", () => {
			const projectId = "project-123"
			const profile = ProjectCloudProfile.create(projectId)

			// Assuming there's no STAGING type
			const env = profile.getEnvironment("STAGING" as EnvironmentType)

			expect(env).toBeUndefined()
		})
	})

	describe("getEnvironments", () => {
		it("should return a copy of environments array", () => {
			const projectId = "project-123"
			const profile = ProjectCloudProfile.create(projectId)

			const envs1 = profile.getEnvironments()
			const envs2 = profile.getEnvironments()

			expect(envs1).not.toBe(envs2)
			expect(envs1).toEqual(envs2)
		})
	})
})
