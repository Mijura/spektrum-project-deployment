import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { GetEntryPoint } from "@app/ports/inbound/get-entry-point"
    
export function createGetEntryPointHandler(useCase: GetEntryPoint) {
    

	return async function createCloudProfileHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

		try {

			return Responses._200()
		} catch (error) {
			return errorHandler(error)
		}
    }
}
