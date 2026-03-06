import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { GetEntryPointParams, GetEntryPointUseCase } from "@app/ports/use-cases/get-entry-point"
import { EnvironmentType } from "@domain/environment"
import { EntryPoint } from "@app/value-objects/entry-point"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createGetEntryPointHandler(getEntryPointUseCase: GetEntryPointUseCase) {
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

			const auth: Auth<UserData> = extractAuthData(event.headers)

			const params: GetEntryPointParams = {
				projectId,
				envType,
			}

			const entryPoint: EntryPoint | null = await getEntryPointUseCase.execute(auth, params)

			if (!entryPoint) {
				return Responses._200({
					moduleId: null,
					assetBaseUrl: null,
					publicAppUrl: null,
				})
			}

			return Responses._200(entryPoint)
		} catch (error: unknown) {
			console.error("Error getting entry point:", error)
			return errorHandler(error)
		}
	}
}
