import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { DeployModuleUseCase } from "@app/ports/use-cases/deploy-module"
import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"
import { schema } from "@infra/http/schemas/deploy-module"
import { EntryPoint } from "@app/value-objects/entry-point"

export function createDeployModuleHandler(deployModuleUseCase: DeployModuleUseCase) {
	return async function deployModuleHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const { body } = event

			if (!body) {
				throw new ValidationError("No page body")
			}

			const parsedBody = JSON.parse(body)
			schemaValidator(schema, parsedBody)

			const deployModuleCommand = parsedBody as DeployModuleCommand

			const entryPoint: EntryPoint = await deployModuleUseCase.execute(deployModuleCommand)

			return Responses._201(entryPoint)
		} catch (error) {
			console.error("Error deploying module:", error)
			return errorHandler(error)
		}
	}
}
