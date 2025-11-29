import { createCloudProfileHandler } from "@infra/http/factories/create-cloud-profile-handler"
import { createCloudProfileUseCase } from "@infra/dependencies"

export const handler = createCloudProfileHandler(createCloudProfileUseCase)