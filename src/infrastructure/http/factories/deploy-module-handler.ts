import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { DeployModule } from "@app/ports/inbound/deploy-module"
import { DeployModuleCommand } from "@app/value-objects/deploy-module-command"
import { schema } from "@infra/http/schemas/deploy-module"
    
export function createDeployModuleHandler(useCase: DeployModule) {
    

	return async function deployModuleHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

		try {

			const { body } = event
			
			if (!body) {
				throw new ValidationError("No page body")
			}
	
			const parsedBody = JSON.parse(body)
			schemaValidator(schema, parsedBody)
			
			const deployModuleCommand = parsedBody as DeployModuleCommand
	
			await useCase.execute(deployModuleCommand)
	
			return Responses._201()
		} catch (error) {
			return errorHandler(error)
		}
    }
}
