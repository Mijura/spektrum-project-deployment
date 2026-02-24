import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { CreateCloudProfileParams, CreateCloudProfileUseCase } from "@app/ports/use-cases/create-cloud-profile"
import { extractAuthData } from "@heksagon/http"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export function createCloudProfileHandler(createCloudProfileUseCase: CreateCloudProfileUseCase) {
	return async function createCloudProfileHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const { body } = event

			if (!body) {
				throw new ValidationError("No page body")
			}

			const parsedBody = JSON.parse(body)
			const projectId = parsedBody.projectId

			const auth: Auth<UserData> = extractAuthData(event.headers)

			console.log("Creating cloud profile for project:", projectId)

			if (!projectId) {
				throw new ValidationError("Missing required path parameter: projectId")
			}

			const params: CreateCloudProfileParams = {
				projectId,
			}

			await createCloudProfileUseCase.execute(auth, params)
			return Responses._201({ message: "Cloud profile created successfully" })
		} catch (error) {
			console.error("Error creating cloud profile:", error)
			return errorHandler(error)
		}
	}
}
