import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { CreateCloudProfile } from "@app/use-cases/create-cloud-profile"
import { DynamoDBCloudProfileRepository } from "./repositories/cloud-profile-repository"
import { GetEntryPoint } from "@app/use-cases/get-entry-point"
import { DeployModule } from "@app/use-cases/deploy-module"
import { JigJoyS3Client } from "./services/jigjoy-s3-client"
import { S3Client } from "@app/ports/services/s3-client"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { JigJoyVersionControl } from "./services/jigjoy-vcs"
import { CreateCloudProfileUseCase } from "@app/ports/use-cases/create-cloud-profile"
import { GetEntryPointUseCase } from "@app/ports/use-cases/get-entry-point"
import { DeployModuleUseCase } from "@app/ports/use-cases/deploy-module"

const versionControlService: VersionControlService = new JigJoyVersionControl()

// Services
export const s3Client: S3Client = new JigJoyS3Client()
const cloudProfileRepo: CloudProfileRepository = new DynamoDBCloudProfileRepository()

// Use Cases
export const createCloudProfileUseCase: CreateCloudProfileUseCase = new CreateCloudProfile(cloudProfileRepo)
export const getEntryPointUseCase: GetEntryPointUseCase = new GetEntryPoint(cloudProfileRepo)
export const deployModuleUseCase: DeployModuleUseCase = new DeployModule(
	cloudProfileRepo,
	versionControlService,
	s3Client,
)
