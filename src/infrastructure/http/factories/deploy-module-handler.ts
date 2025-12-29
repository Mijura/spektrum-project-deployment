import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { DeployModule } from "@app/ports/use-cases/deploy-module"
import { DeployModuleDTO } from "@app/dto/deploy-module"
import { schema } from "@infra/http/schemas/deploy-module"
import { EntryPointDTO } from "@app/dto/entry-point"
    
export function createDeployModuleHandler(useCase: DeployModule) {
    

	return async function deployModuleHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

		try {

			const { body } = event
			
			if (!body) {
				throw new ValidationError("No page body")
			}
	
			const parsedBody = JSON.parse(body)
			schemaValidator(schema, parsedBody)
			
			const deployModuleDTO = parsedBody as DeployModuleDTO
	
			const entryPointInfo: EntryPointDTO = await useCase.execute(deployModuleDTO)
	
			return Responses._201(entryPointInfo)
		} catch (error) {
			console.error("Error deploying module:", error)
			return errorHandler(error)
		}
    }
}
