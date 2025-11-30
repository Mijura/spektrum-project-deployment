import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { CreateCloudProfile } from "@app/ports/inbound/create-cloud-profile"
    
export function createCloudProfileHandler(useCase: CreateCloudProfile) {
    

	return async function createCloudProfileHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

		try {
			const projectId = event.pathParameters?.projectId
			
			if (!projectId) {
				throw new ValidationError("Missing required path parameter: projectId")
			}

			await useCase.execute(projectId)
			return Responses._200()
		} catch (error) {
			return errorHandler(error)
		}
    }
}
