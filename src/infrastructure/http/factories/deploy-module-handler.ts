import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-ai/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { DeployModuleParams, DeployModuleUseCase } from "@app/ports/use-cases/deploy-module"
import { schema } from "@infra/http/schemas/deploy-module"
import { EntryPoint } from "@app/value-objects/entry-point"
import { extractAuthData } from "@heksagon/http"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export function createDeployModuleHandler(deployModuleUseCase: DeployModuleUseCase) {
	return async function deployModuleHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const { body } = event

			if (!body) {
				throw new ValidationError("No page body")
			}

			const parsedBody = JSON.parse(body)
			schemaValidator(schema, parsedBody)

			const auth: Auth<UserData> = extractAuthData(event.headers)

			const deployModuleParams: DeployModuleParams = {
				projectId: parsedBody.projectId,
				moduleId: parsedBody.moduleId,
				moduleType: parsedBody.moduleType,
				versionControlId: parsedBody.versionControlId,
				environmentType: parsedBody.environmentType,
				setAsEntryPoint: parsedBody.setAsEntryPoint,
			}

			const entryPoint: EntryPoint = await deployModuleUseCase.execute(auth, deployModuleParams)

			return Responses._200(entryPoint)
		} catch (error) {
			console.error("Error deploying module:", error)
			return errorHandler(error)
		}
	}
}
