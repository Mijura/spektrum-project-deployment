import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { CreateCloudProfileUseCase } from "@app/use-cases/create-cloud-profile"
import { DynamoDBCloudProfileRepository } from "./repositories/cloud-profile-repository"
import { GetEntryPointUseCase } from "@app/use-cases/get-entry-point"
import { DeployModuleUseCase } from "@app/use-cases/deploy-module"
import { JigJoyS3Client } from "./services/jigjoy-s3-client"
import { S3Client } from "@app/ports/services/s3-client"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { JigJoyVersionControl } from "./services/jigjoy-vcs"

const versionControlService: VersionControlService = new JigJoyVersionControl()

// Services
export const s3Client: S3Client = new JigJoyS3Client()
const cloudProfileRepo: CloudProfileRepository = new DynamoDBCloudProfileRepository()

// Use Cases
export const createCloudProfileUseCase = new CreateCloudProfileUseCase(cloudProfileRepo)
export const getEntryPointUseCase = new GetEntryPointUseCase(cloudProfileRepo)
export const deployModuleUseCase = new DeployModuleUseCase(cloudProfileRepo, versionControlService, s3Client)
