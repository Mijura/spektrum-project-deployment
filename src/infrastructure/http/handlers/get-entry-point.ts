import { getEntryPointUseCase } from "@infra/dependencies"
import { createGetEntryPointHandler } from "@infra/http/factories/get-entry-point-handler"

export const handler = createGetEntryPointHandler(getEntryPointUseCase)
