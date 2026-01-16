import { describe, it, expect } from "@rstest/core"
import { DeploymentLog, DeploymentStatus } from "@domain/deployment-log"

describe("DeploymentLog", () => {
	describe("create", () => {
		it("should create a deployment log with IN_PROGRESS status", () => {
			const versionId = "version-123"

			const log = DeploymentLog.create(versionId)

			expect(log.id).toBeDefined()
			expect(log.versionId).toBe(versionId)
			expect(log.status).toBe(DeploymentStatus.IN_PROGRESS)
			expect(log.startedAt).toBeDefined()
			expect(log.finishedAt).toBeNull()
		})

		it("should generate a unique id for each log", () => {
			const log1 = DeploymentLog.create("version-1")
			const log2 = DeploymentLog.create("version-2")

			expect(log1.id).not.toBe(log2.id)
		})

		it("should set startedAt to current ISO timestamp", () => {
			const before = new Date().toISOString()
			const log = DeploymentLog.create("version-1")
			const after = new Date().toISOString()

			expect(log.startedAt).toBeDefined()
			expect(log.startedAt >= before).toBe(true)
			expect(log.startedAt <= after).toBe(true)
		})
	})

	describe("setFinalStatus", () => {
		it("should set status to SUCCEEDED and set finishedAt", () => {
			const log = DeploymentLog.create("version-1")
			const before = new Date().toISOString()

			log.setFinalStatus(DeploymentStatus.SUCCEEDED)

			expect(log.status).toBe(DeploymentStatus.SUCCEEDED)
			expect(log.finishedAt).toBeDefined()
			expect(log.finishedAt).not.toBeNull()
			expect(log.finishedAt! >= before).toBe(true)
		})

		it("should set status to FAILED and set finishedAt", () => {
			const log = DeploymentLog.create("version-1")
			const before = new Date().toISOString()

			log.setFinalStatus(DeploymentStatus.FAILED)

			expect(log.status).toBe(DeploymentStatus.FAILED)
			expect(log.finishedAt).toBeDefined()
			expect(log.finishedAt).not.toBeNull()
			expect(log.finishedAt! >= before).toBe(true)
		})

		it("should throw an error if status is not IN_PROGRESS", () => {
			const log = DeploymentLog.create("version-1")
			log.setFinalStatus(DeploymentStatus.SUCCEEDED)

			expect(() => {
				log.setFinalStatus(DeploymentStatus.FAILED)
			}).toThrow("You can only change in progress status")
		})

		it("should throw an error when trying to change from FAILED status", () => {
			const log = DeploymentLog.create("version-1")
			log.setFinalStatus(DeploymentStatus.FAILED)

			expect(() => {
				log.setFinalStatus(DeploymentStatus.SUCCEEDED)
			}).toThrow("You can only change in progress status")
		})
	})

	describe("rehydrate", () => {
		it("should rehydrate a deployment log from existing data", () => {
			const data = {
				id: "log-123",
				versionId: "version-456",
				startedAt: "2024-01-01T00:00:00.000Z",
				finishedAt: "2024-01-01T01:00:00.000Z",
				status: DeploymentStatus.SUCCEEDED,
			}

			const log = DeploymentLog.rehydrate(data)

			expect(log.id).toBe(data.id)
			expect(log.versionId).toBe(data.versionId)
			expect(log.startedAt).toBe(data.startedAt)
			expect(log.finishedAt).toBe(data.finishedAt)
			expect(log.status).toBe(data.status)
		})

		it("should rehydrate a deployment log with null finishedAt", () => {
			const data = {
				id: "log-123",
				versionId: "version-456",
				startedAt: "2024-01-01T00:00:00.000Z",
				finishedAt: null,
				status: DeploymentStatus.IN_PROGRESS,
			}

			const log = DeploymentLog.rehydrate(data)

			expect(log.id).toBe(data.id)
			expect(log.finishedAt).toBeNull()
			expect(log.status).toBe(DeploymentStatus.IN_PROGRESS)
		})
	})
})
