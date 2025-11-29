import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { DeployModule } from "@app/ports/inbound/deploy-module"
    
export function createDeployModuleHandler(useCase: DeployModule) {
    

	return async function createCloudProfileHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

		try {




			return Responses._200()
		} catch (error) {
			return errorHandler(error)
		}
    }
}
