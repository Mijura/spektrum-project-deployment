import { GetEntryPointUseCase } from "@app/ports/use-cases/get-entry-point"
import { GetEntryPoint } from "@app/use-cases/get-entry-point"
import { createGetEntryPointHandler } from "@infra/http/factories/get-entry-point-handler"
import { cloudProfileRepo } from "@infra/repositories/cloud-profile-repository"

export const getEntryPointUseCase: GetEntryPointUseCase = new GetEntryPoint(cloudProfileRepo)

export const handler = createGetEntryPointHandler(getEntryPointUseCase)
