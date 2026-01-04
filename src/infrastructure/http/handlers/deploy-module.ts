import { deployModuleUseCase } from "@infra/dependencies"
import { createDeployModuleHandler } from "@infra/http/factories/deploy-module-handler"

export const handler = createDeployModuleHandler(deployModuleUseCase)
