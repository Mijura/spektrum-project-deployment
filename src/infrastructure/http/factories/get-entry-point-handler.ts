import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { GetEntryPoint } from "@app/ports/inbound/get-entry-point"
import { EnvironmentType } from "@domain/value-objects/environment"
    
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
            
            const entryPointInfo = await useCase.execute(projectId, envType)

			return Responses._200(entryPointInfo)
		} catch (error) {
			return errorHandler(error)
		}
    }
}
