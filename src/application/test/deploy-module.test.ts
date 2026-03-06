import { describe, it, expect, beforeEach } from "@rstest/core"

import { DeployModule } from "@app/use-cases/deploy-module"
import { MockCloudProfileRepository } from "@app/test/mocks/mock-cloud-profile-repository"
import { MockVersionControlService } from "@app/test/mocks/mock-version-control-service"
import { MockS3Client } from "@app/test/mocks/mock-s3-client"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { S3Client } from "@app/ports/services/s3-client"
import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"
import { Version } from "@app/value-objects/version"
import { FileArtifacts } from "@app/value-objects/file-artifacts"
import { EnvironmentType } from "@domain/environment"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { DeploymentTarget } from "@domain/deployment-target"
import { S3 } from "@domain/service/s3"

describe("DeployModule", () => {
	let deployModuleUseCase: DeployModule
	let repository: CloudProfileRepository
	let versionControlService: VersionControlService
	let s3Client: S3Client

	const BUCKET = "test-bucket"

	beforeEach(() => {
		repository = new MockCloudProfileRepository()
		versionControlService = new MockVersionControlService()
		s3Client = new MockS3Client()
		deployModuleUseCase = new DeployModule(repository, versionControlService, s3Client)
		process.env.WEB_HOSTING_BUCKET = BUCKET
	})

	it("should successfully deploy a module to an existing profile", async () => {
		// Arrange
		const projectId = "project-123"
		const moduleId = "module-456"
		const versionControlId = "version-789"
		const profile = ProjectCloudProfile.create(projectId)
		await repository.save(profile)

		const buildArtifacts: FileArtifacts = {
			"index.html": "<html>test</html>",
			"main.js": "console.log('test')",
		}

		const version: Version = {
			repositoryId: versionControlId,
			buildArtifacts,
			sourceCodeArtifacts: {},
		}

		;(versionControlService as MockVersionControlService).setVersion(versionControlId, version)

		const command: DeployModuleCommand = {
			projectId,
			moduleId,
			moduleType: "frontend",
			versionControlId,
			environmentType: EnvironmentType.DEV,
			setAsEntryPoint: true,
		}

		// Act
		const result = await deployModuleUseCase.execute(command)

		// Assert
		expect(result).toBeDefined()
		expect(result.moduleId).toBe(moduleId)
		expect(result.assetBaseUrl).toBeDefined()
		expect(result.publicAppUrl).toBeDefined()

		const mockS3 = s3Client as MockS3Client
		const uploads = mockS3.getUploads()
		expect(uploads).toHaveLength(1)
		expect(uploads[0].bucket).toBe(BUCKET)
		expect(uploads[0].fileArtifacts).toEqual(buildArtifacts)
	})

	it("should create profile lazily if it does not exist", async () => {
		// Arrange
		const projectId = "project-new"
		const moduleId = "module-new"
		const versionControlId = "version-new"

		const buildArtifacts: FileArtifacts = {
			"index.html": "<html>new</html>",
		}

		const version: Version = {
			repositoryId: versionControlId,
			buildArtifacts,
			sourceCodeArtifacts: {},
		}

		;(versionControlService as MockVersionControlService).setVersion(versionControlId, version)

		const command: DeployModuleCommand = {
			projectId,
			moduleId,
			moduleType: "frontend",
			versionControlId,
			environmentType: EnvironmentType.DEV,
		}

		// Act
		await deployModuleUseCase.execute(command)

		// Assert
		const savedProfile = await repository.getByProjectId(projectId)
		expect(savedProfile).toBeDefined()
		expect(savedProfile?.projectId).toBe(projectId)
	})

	it("should set module as entry point when setAsEntryPoint is true", async () => {
		// Arrange
		const projectId = "project-entry"
		const moduleId = "module-entry"
		const versionControlId = "version-entry"
		const profile = ProjectCloudProfile.create(projectId)
		await repository.save(profile)

		const version: Version = {
			repositoryId: versionControlId,
			buildArtifacts: {},
			sourceCodeArtifacts: {},
		}

		;(versionControlService as MockVersionControlService).setVersion(versionControlId, version)

		const command: DeployModuleCommand = {
			projectId,
			moduleId,
			moduleType: "frontend",
			versionControlId,
			environmentType: EnvironmentType.DEV,
			setAsEntryPoint: true,
		}

		// Act
		await deployModuleUseCase.execute(command)

		// Assert
		const savedProfile = await repository.getByProjectId(projectId)
		const env = savedProfile?.getEnvironment(EnvironmentType.DEV)
		const entryPoint = env?.getEntryPoint()
		expect(entryPoint).toBeDefined()
		expect(entryPoint?.getModuleId()).toBe(moduleId)
	})

	it("should not set entry point when setAsEntryPoint is false", async () => {
		// Arrange
		const projectId = "project-no-entry"
		const moduleId = "module-no-entry"
		const versionControlId = "version-no-entry"
		const profile = ProjectCloudProfile.create(projectId)
		await repository.save(profile)

		const version: Version = {
			repositoryId: versionControlId,
			buildArtifacts: {},
			sourceCodeArtifacts: {},
		}

		;(versionControlService as MockVersionControlService).setVersion(versionControlId, version)

		const command: DeployModuleCommand = {
			projectId,
			moduleId,
			moduleType: "frontend",
			versionControlId,
			environmentType: EnvironmentType.DEV,
			setAsEntryPoint: false,
		}

		// Act
		await deployModuleUseCase.execute(command)

		// Assert
		const savedProfile = await repository.getByProjectId(projectId)
		const env = savedProfile?.getEnvironment(EnvironmentType.DEV)
		const entryPoint = env?.getEntryPoint()
		expect(entryPoint).toBeUndefined()
	})

	it("should upload build artifacts to S3", async () => {
		// Arrange
		const projectId = "project-upload"
		const moduleId = "module-upload"
		const versionControlId = "version-upload"
		const profile = ProjectCloudProfile.create(projectId)
		await repository.save(profile)

		const buildArtifacts: FileArtifacts = {
			"index.html": "<html>content</html>",
			"app.js": "const app = {}",
			"styles.css": "body { margin: 0; }",
		}

		const version: Version = {
			repositoryId: versionControlId,
			buildArtifacts,
			sourceCodeArtifacts: {},
		}

		;(versionControlService as MockVersionControlService).setVersion(versionControlId, version)

		const command: DeployModuleCommand = {
			projectId,
			moduleId,
			moduleType: "frontend",
			versionControlId,
			environmentType: EnvironmentType.DEV,
		}

		// Act
		await deployModuleUseCase.execute(command)

		// Assert
		const mockS3 = s3Client as MockS3Client
		const uploads = mockS3.getUploads()
		expect(uploads).toHaveLength(1)
		expect(uploads[0].bucket).toBe(BUCKET)
		expect(uploads[0].fileArtifacts).toEqual(buildArtifacts)
		expect(uploads[0].folder).toBeDefined()
	})

	it("should throw error when environment not found", async () => {
		// Arrange
		const projectId = "project-error"
		const moduleId = "module-error"
		const versionControlId = "version-error"
		// Create a profile rehydrated from DB without the expected environment
		// This simulates a corrupted or incorrectly saved profile
		const profile = ProjectCloudProfile.rehydrate(projectId, [])
		await repository.save(profile)

		const command: DeployModuleCommand = {
			projectId,
			moduleId,
			moduleType: "frontend",
			versionControlId,
			environmentType: EnvironmentType.DEV,
		}

		// Act & Assert
		await expect(deployModuleUseCase.execute(command)).rejects.toThrow("Environment not found")
	})

	it("should update existing deployment target when it already exists", async () => {
		// Arrange
		const projectId = "project-existing-target"
		const moduleId = "module-existing"
		const versionControlId = "version-existing"
		const existingRevisionId = "old-revision"
		const profile = ProjectCloudProfile.create(projectId)
		const env = profile.getEnvironment(EnvironmentType.DEV)
		const service = S3.create(BUCKET, `https://${BUCKET}.s3.eu-west-1.amazonaws.com`, "development.jigjoy.io")
		const existingTarget = DeploymentTarget.create(moduleId, existingRevisionId, service)
		env?.addDeploymentTarget(existingTarget)
		profile.updateEnvironment(env!)
		await repository.save(profile)

		const buildArtifacts: FileArtifacts = {
			"index.html": "<html>updated</html>",
		}

		// When a deployment target exists, the use case uses its existing revisionId to pull artifacts
		const version: Version = {
			repositoryId: existingRevisionId,
			buildArtifacts,
			sourceCodeArtifacts: {},
		}

		;(versionControlService as MockVersionControlService).setVersion(existingRevisionId, version)

		const command: DeployModuleCommand = {
			projectId,
			moduleId,
			moduleType: "frontend",
			versionControlId,
			environmentType: EnvironmentType.DEV,
		}

		// Act
		const result = await deployModuleUseCase.execute(command)

		// Assert
		expect(result).toBeDefined()
		expect(result.moduleId).toBe(moduleId)
		// Should still upload new artifacts
		const mockS3 = s3Client as MockS3Client
		const uploads = mockS3.getUploads()
		expect(uploads).toHaveLength(1)
		expect(uploads[0].fileArtifacts).toEqual(buildArtifacts)
	})

	it("should persist updated profile after deployment", async () => {
		// Arrange
		const projectId = "project-persist"
		const moduleId = "module-persist"
		const versionControlId = "version-persist"
		const profile = ProjectCloudProfile.create(projectId)
		await repository.save(profile)

		const version: Version = {
			repositoryId: versionControlId,
			buildArtifacts: {},
			sourceCodeArtifacts: {},
		}

		;(versionControlService as MockVersionControlService).setVersion(versionControlId, version)

		const command: DeployModuleCommand = {
			projectId,
			moduleId,
			moduleType: "frontend",
			versionControlId,
			environmentType: EnvironmentType.PROD,
			setAsEntryPoint: true,
		}

		// Act
		await deployModuleUseCase.execute(command)

		// Assert
		const savedProfile = await repository.getByProjectId(projectId)
		expect(savedProfile).toBeDefined()
		const env = savedProfile?.getEnvironment(EnvironmentType.PROD)
		const deploymentTarget = env?.getDeploymentTarget(moduleId)
		expect(deploymentTarget).toBeDefined()
		expect(deploymentTarget?.getModuleId()).toBe(moduleId)
	})
})
