import { Responses } from "@jigjoy-ai/serverless-core"

/**
 * Handles errors and converts them to appropriate API Gateway responses.
 *
 * @param error - The error to handle, which can be an Error instance or any unknown type
 * @returns An API Gateway proxy result with an appropriate status code and error message
 */
export function errorHandler(error: Error | unknown) {
	console.error(error)

	let response: any

	if (error instanceof Error) {
		switch (error.name) {
			case "ValidationError":
				response = Responses._400({ errorMessage: error.message })
				break
			default:
				response = Responses._500({ errorMessage: "Something went wrong" })
				break
		}
	} else {
		response = Responses._500({ errorMessage: "Something went wrong" })
	}

	return response
}
