import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { CreateCloudProfileUseCase } from "@app/ports/use-cases/create-cloud-profile"

export function createCloudProfileHandler(createCloudProfileUseCase: CreateCloudProfileUseCase) {
	return async function createCloudProfileHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const { body } = event

			if (!body) {
				throw new ValidationError("No page body")
			}

			const parsedBody = JSON.parse(body)
			const projectId = parsedBody.projectId

			console.log("Creating cloud profile for project:", projectId)

			if (!projectId) {
				throw new ValidationError("Missing required path parameter: projectId")
			}

			await createCloudProfileUseCase.execute(projectId)
			return Responses._200()
		} catch (error) {
			console.error("Error creating cloud profile:", error)
			return errorHandler(error)
		}
	}
}
