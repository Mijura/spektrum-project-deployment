import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { GetEntryPoint } from "@app/ports/use-cases/get-entry-point"
import { EnvironmentType } from "@domain/environment"
import { EntryPoint } from "@app/value-objects/entry-point"

export function createGetEntryPointHandler(useCase: GetEntryPoint) {
	return async function createCloudProfileHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const projectId = event.pathParameters?.projectId
			const environment = event.pathParameters?.environment

			if (!projectId) {
				throw new ValidationError("Missing required path parameter: projectId")
			}

			if (!environment) {
				throw new ValidationError("Missing required path parameter: environment")
			}

			const envType = EnvironmentType[environment as keyof typeof EnvironmentType]

			const entryPoint: EntryPoint | null = await useCase.execute(projectId, envType)

			if (!entryPoint) {
				return Responses._404()
			}

			return Responses._200(entryPoint)
		} catch (error) {
			console.error("Error getting entry point:", error)
			return errorHandler(error)
		}
	}
}
