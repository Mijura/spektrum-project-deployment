import { describe, it, expect, beforeAll } from "@rstest/core"
import { JigJoyVersionControl } from "@infra/services/version-control-service/jigjoy-vcs"

describe("JigJoyVersionControl Integration Tests", () => {
	let service: JigJoyVersionControl
	let testRepositoryId: string

	beforeAll(async () => {
		service = new JigJoyVersionControl()
		testRepositoryId = await service.initializeRepository()

		// Push initial version data to avoid 500 error when pulling from empty ProjectHistory
		const buildArtifacts = {
			"index.html": "<html><body>Test</body></html>",
			"app.js": "console.log('test');",
		}
		const sourceCodeArtifacts = {
			"src/index.ts": "export const test = 'test';",
		}

		await service.push(testRepositoryId, buildArtifacts, sourceCodeArtifacts)
	}, 10_000)

	it("should pull version from version control service", async () => {
		const version = await service.pull(testRepositoryId)

		expect(version).toBeDefined()
		expect(version.repositoryId).toBeDefined()
		expect(version.buildArtifacts).toBeDefined()
		expect(version.sourceCodeArtifacts).toBeDefined()
	}, 5_000)
})
