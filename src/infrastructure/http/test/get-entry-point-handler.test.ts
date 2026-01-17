import { APIGatewayProxyEvent } from "aws-lambda"

import { describe, it, expect, beforeEach } from "@rstest/core"

import { GetEntryPointUseCase } from "@app/ports/use-cases/get-entry-point"

import { createGetEntryPointHandler } from "@infra/http/factories/get-entry-point-handler"

import { EntryPoint } from "@app/value-objects/entry-point"
import { EnvironmentType } from "@domain/environment"

describe("Get Entry Point Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and entry point data when entry point exists", async () => {
		const mockEntryPoint: EntryPoint = {
			moduleId: "module-123",
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}

		const mockUseCase: GetEntryPointUseCase = {
			execute: async () => mockEntryPoint,
		}

		handler = createGetEntryPointHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-123",
				environment: "DEV",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.moduleId).toBe("module-123")
		expect(body.assetBaseUrl).toBe("https://assets.example.com")
		expect(body.publicAppUrl).toBe("https://app.example.com")
	})

	it("returns 404 when entry point does not exist", async () => {
		const mockUseCase: GetEntryPointUseCase = {
			execute: async () => null,
		}

		handler = createGetEntryPointHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-456",
				environment: "DEV",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(404)
	})

	it("returns 400 when projectId is missing from path parameters", async () => {
		const mockUseCase: GetEntryPointUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetEntryPointHandler(mockUseCase)

		const event = {
			pathParameters: {
				environment: "DEV",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required path parameter: projectId")
	})

	it("returns 400 when environment is missing from path parameters", async () => {
		const mockUseCase: GetEntryPointUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetEntryPointHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-789",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required path parameter: environment")
	})

	it("returns 200 for PROD environment", async () => {
		const mockEntryPoint: EntryPoint = {
			moduleId: "module-prod",
			assetBaseUrl: "https://assets.prod.com",
			publicAppUrl: "https://app.prod.com",
		}

		const mockUseCase: GetEntryPointUseCase = {
			execute: async () => mockEntryPoint,
		}

		handler = createGetEntryPointHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-prod",
				environment: "PROD",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.moduleId).toBe("module-prod")
		expect(body.assetBaseUrl).toBe("https://assets.prod.com")
		expect(body.publicAppUrl).toBe("https://app.prod.com")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: GetEntryPointUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createGetEntryPointHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-error",
				environment: "DEV",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
