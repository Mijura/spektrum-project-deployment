import { describe, it, expect } from "@rstest/core"
import { Environment, EnvironmentType } from "@domain/environment"
import { DeploymentTarget } from "@domain/deployment-target"
import { S3 } from "@domain/service/s3"

describe("Environment", () => {
	describe("create", () => {
		it("should create an environment with the given type", () => {
			const env = Environment.create(EnvironmentType.DEV)

			expect(env.getType()).toBe(EnvironmentType.DEV)
			expect(env.deploymentTargets).toHaveLength(0)
			expect(env.getEntryPoint()).toBeUndefined()
		})

		it("should create a production environment", () => {
			const env = Environment.create(EnvironmentType.PROD)

			expect(env.getType()).toBe(EnvironmentType.PROD)
		})
	})

	describe("addDeploymentTarget", () => {
		it("should add a deployment target to the environment", () => {
			const env = Environment.create(EnvironmentType.DEV)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target = DeploymentTarget.create("module-1", "rev-1", service)

			env.addDeploymentTarget(target)

			expect(env.deploymentTargets).toHaveLength(1)
			expect(env.getDeploymentTarget("module-1")).toBeDefined()
		})

		it("should add multiple deployment targets", () => {
			const env = Environment.create(EnvironmentType.DEV)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target1 = DeploymentTarget.create("module-1", "rev-1", service)
			const target2 = DeploymentTarget.create("module-2", "rev-2", service)

			env.addDeploymentTarget(target1)
			env.addDeploymentTarget(target2)

			expect(env.deploymentTargets).toHaveLength(2)
		})
	})

	describe("updateDeploymentTarget", () => {
		it("should update an existing deployment target", () => {
			const env = Environment.create(EnvironmentType.DEV)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target1 = DeploymentTarget.create("module-1", "rev-1", service)
			env.addDeploymentTarget(target1)

			const newService = S3.create("new-bucket", "https://new-bucket.s3.amazonaws.com", "new-cloudfront.net")
			const updatedTarget = DeploymentTarget.create("module-1", "rev-2", newService)
			env.updateDeploymentTarget(updatedTarget)

			const retrieved = env.getDeploymentTarget("module-1")
			expect(retrieved).toBeDefined()
			expect(retrieved?.getRevisionId()).toBe("rev-2")
		})

		it("should not update if deployment target does not exist", () => {
			const env = Environment.create(EnvironmentType.DEV)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target = DeploymentTarget.create("module-1", "rev-1", service)

			env.updateDeploymentTarget(target)

			expect(env.deploymentTargets).toHaveLength(0)
		})
	})

	describe("getDeploymentTarget", () => {
		it("should return the deployment target for the given module id", () => {
			const env = Environment.create(EnvironmentType.DEV)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target = DeploymentTarget.create("module-1", "rev-1", service)
			env.addDeploymentTarget(target)

			const retrieved = env.getDeploymentTarget("module-1")

			expect(retrieved).toBeDefined()
			expect(retrieved?.getModuleId()).toBe("module-1")
		})

		it("should return undefined for non-existent module id", () => {
			const env = Environment.create(EnvironmentType.DEV)

			const retrieved = env.getDeploymentTarget("non-existent")

			expect(retrieved).toBeUndefined()
		})
	})

	describe("setEntryPoint", () => {
		it("should set the entry point for an existing deployment target", () => {
			const env = Environment.create(EnvironmentType.DEV)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target = DeploymentTarget.create("module-1", "rev-1", service)
			env.addDeploymentTarget(target)

			env.setEntryPoint("module-1")

			const entryPoint = env.getEntryPoint()
			expect(entryPoint).toBeDefined()
			expect(entryPoint?.getModuleId()).toBe("module-1")
		})

		it("should throw an error if deployment target does not exist", () => {
			const env = Environment.create(EnvironmentType.DEV)

			expect(() => {
				env.setEntryPoint("non-existent")
			}).toThrow("Entry point target must exist in this environment")
		})
	})

	describe("getEntryPoint", () => {
		it("should return the entry point deployment target", () => {
			const env = Environment.create(EnvironmentType.DEV)
			const service = S3.create("bucket", "https://bucket.s3.amazonaws.com", "cloudfront.net")
			const target = DeploymentTarget.create("module-1", "rev-1", service)
			env.addDeploymentTarget(target)
			env.setEntryPoint("module-1")

			const entryPoint = env.getEntryPoint()

			expect(entryPoint).toBeDefined()
			expect(entryPoint?.getModuleId()).toBe("module-1")
		})

		it("should return undefined if no entry point is set", () => {
			const env = Environment.create(EnvironmentType.DEV)

			const entryPoint = env.getEntryPoint()

			expect(entryPoint).toBeUndefined()
		})
	})

	describe("getType", () => {
		it("should return the environment type", () => {
			const devEnv = Environment.create(EnvironmentType.DEV)
			const prodEnv = Environment.create(EnvironmentType.PROD)

			expect(devEnv.getType()).toBe(EnvironmentType.DEV)
			expect(prodEnv.getType()).toBe(EnvironmentType.PROD)
		})
	})
})

