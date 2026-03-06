import { DeployModuleUseCase } from "@app/ports/use-cases/deploy-module"
import { DeployModule } from "@app/use-cases/deploy-module"
import { createDeployModuleHandler } from "@infra/http/factories/deploy-module-handler"
import { cloudProfileRepo } from "@infra/repositories/cloud-profile-repository"
import { s3Client } from "@infra/services/s3-client"
import { versionControlService } from "@infra/services/version-control-service"

export const deployModuleUseCase: DeployModuleUseCase = new DeployModule(
	cloudProfileRepo,
	versionControlService,
	s3Client,
)

export const handler = createDeployModuleHandler(deployModuleUseCase)
