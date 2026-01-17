import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { CreateCloudProfileUseCase } from "@app/ports/use-cases/create-cloud-profile"
import { createCloudProfileHandler } from "@infra/http/factories/create-cloud-profile-handler"

describe("Create Cloud Profile Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 201 when projectId is provided", async () => {
		const mockUseCase: CreateCloudProfileUseCase = {
			execute: async () => {
				// Success case - no return value
			},
		}

		handler = createCloudProfileHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(201)

		const body = JSON.parse(result.body)

		expect(body.message).toBe("Cloud profile created successfully")
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: CreateCloudProfileUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createCloudProfileHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 400 when projectId is missing from body", async () => {
		const mockUseCase: CreateCloudProfileUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createCloudProfileHandler(mockUseCase)

		const event = {
			body: JSON.stringify({}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required path parameter: projectId")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: CreateCloudProfileUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createCloudProfileHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})

	it("returns 500 when a non-Error value is thrown", async () => {
		const mockUseCase: CreateCloudProfileUseCase = {
			execute: async () => {
				// Throw a non-Error value to test the else branch in error handler
				throw "String error"
			},
		}

		handler = createCloudProfileHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
