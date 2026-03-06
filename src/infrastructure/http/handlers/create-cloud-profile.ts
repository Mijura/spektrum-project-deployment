import { CreateCloudProfileUseCase } from "@app/ports/use-cases/create-cloud-profile"
import { CreateCloudProfile } from "@app/use-cases/create-cloud-profile"
import { createCloudProfileHandler } from "@infra/http/factories/create-cloud-profile-handler"
import { cloudProfileRepo } from "@infra/repositories/cloud-profile-repository"

export const createCloudProfileUseCase: CreateCloudProfileUseCase = new CreateCloudProfile(cloudProfileRepo)

export const handler = createCloudProfileHandler(createCloudProfileUseCase)
