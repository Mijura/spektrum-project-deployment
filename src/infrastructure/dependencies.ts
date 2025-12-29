
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { StaticWebsiteHosting } from "@app/ports/services/static-website-hosting"
import { CreateCloudProfileUseCase } from "@app/use-cases/create-cloud-profile"
import { S3WebsiteHosting } from "@infra/website-hosting/s3-website-hosting"
import { ProjectVersioningClient } from "@jigjoy-io/project-versioning-client"
import { DynamoDBCloudProfileRepository } from "./repositories/cloud-profile-repository"
import { GetEntryPointUseCase } from "@app/use-cases/get-entry-point"
import { DeployModuleUseCase } from "@app/use-cases/deploy-module"


const projectVersioningEndpoint = process.env.PROJECT_VERSIONING_ENDPOINT || ""
const versioningClient = new ProjectVersioningClient(projectVersioningEndpoint)

// Services
export const hostingService: StaticWebsiteHosting = new S3WebsiteHosting(versioningClient)
const cloudProfileRepo: CloudProfileRepository = new DynamoDBCloudProfileRepository()

// Use Cases
export const createCloudProfileUseCase = new CreateCloudProfileUseCase(cloudProfileRepo)
export const getEntryPointUseCase = new GetEntryPointUseCase(cloudProfileRepo)
export const deployModuleUseCase = new DeployModuleUseCase(cloudProfileRepo, hostingService)