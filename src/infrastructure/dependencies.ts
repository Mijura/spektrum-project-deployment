
import { CloudProfileRepository } from "@app/ports/outbound/project-cloud-profile-repository"
import { StaticWebsiteHosting } from "@app/ports/outbound/static-website-hosting"
import { CreateCloudProfileUseCase } from "@app/use-cases/create-cloud-profile"
import { S3WebsiteHosting } from "@infra/website-hosting/s3-website-hosting"
import { ProjectArtifactsClient } from "@jigjoy-io/project-artifacts-client"
import { DynamoDBCloudProfileRepository } from "./storage/cloud-profile-repository"
import { GetEntryPointUseCase } from "@app/use-cases/get-entry-point"
import { DeployModuleUseCase } from "@app/use-cases/deploy-module"


// Version Storages
const bucket = process.env.WEB_HOSTING_BUCKET

if (!bucket) 
    throw new Error('Missing WEB_HOSTING_BUCKET env variable')

const artifactsClient = new ProjectArtifactsClient()

// Services
export const hostingService: StaticWebsiteHosting = new S3WebsiteHosting(artifactsClient)
const cloudProfileRepo: CloudProfileRepository = new DynamoDBCloudProfileRepository()

// Use Cases
export const createCloudProfileUseCase = new CreateCloudProfileUseCase(cloudProfileRepo)
export const getEntryPointUseCase = new GetEntryPointUseCase(cloudProfileRepo)
export const deployModuleUseCase = new DeployModuleUseCase(cloudProfileRepo, hostingService)