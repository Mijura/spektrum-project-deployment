import { describe, it, expect, beforeEach } from "@rstest/core"

import { CreateCloudProfile } from "@app/use-cases/create-cloud-profile"
import { MockCloudProfileRepository } from "@app/test/mocks/mock-cloud-profile-repository"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { EnvironmentType } from "@domain/environment"

describe("CreateCloudProfile", () => {
	let createCloudProfileUseCase: CreateCloudProfile
	let repository: CloudProfileRepository

	beforeEach(() => {
		repository = new MockCloudProfileRepository()
		createCloudProfileUseCase = new CreateCloudProfile(repository)
	})

	it("should successfully create a cloud profile for a project", async () => {
		// Arrange
		const projectId = "project-123"

		// Act
		await createCloudProfileUseCase.execute(projectId)

		// Assert
		const savedProfile = await repository.getByProjectId(projectId)
		expect(savedProfile).toBeDefined()
		expect(savedProfile?.projectId).toBe(projectId)
		expect(savedProfile?.getEnvironments()).toHaveLength(2)
		expect(savedProfile?.getEnvironment(EnvironmentType.DEV)).toBeDefined()
		expect(savedProfile?.getEnvironment(EnvironmentType.PROD)).toBeDefined()
	})

	it("should throw error when cloud profile already exists", async () => {
		// Arrange
		const projectId = "project-456"
		const existingProfile = ProjectCloudProfile.create(projectId)
		await repository.save(existingProfile)

		// Act & Assert
		await expect(createCloudProfileUseCase.execute(projectId)).rejects.toThrow(
			"Cloud Profile for given project already exists",
		)
	})

	it("should create profile with both DEV and PROD environments", async () => {
		// Arrange
		const projectId = "project-789"

		// Act
		await createCloudProfileUseCase.execute(projectId)

		// Assert
		const savedProfile = await repository.getByProjectId(projectId)
		expect(savedProfile).toBeDefined()
		const devEnv = savedProfile?.getEnvironment(EnvironmentType.DEV)
		const prodEnv = savedProfile?.getEnvironment(EnvironmentType.PROD)
		expect(devEnv).toBeDefined()
		expect(prodEnv).toBeDefined()
		expect(devEnv?.getType()).toBe(EnvironmentType.DEV)
		expect(prodEnv?.getType()).toBe(EnvironmentType.PROD)
	})

	it("should persist the profile to repository", async () => {
		// Arrange
		const projectId = "project-abc"

		// Act
		await createCloudProfileUseCase.execute(projectId)

		// Assert
		const mockRepo = repository as MockCloudProfileRepository
		const allProfiles = mockRepo.getAllProfiles()
		expect(allProfiles).toHaveLength(1)
		expect(allProfiles[0].projectId).toBe(projectId)
	})
})
