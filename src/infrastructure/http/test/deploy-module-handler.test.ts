import { APIGatewayProxyEvent } from "aws-lambda"

import { describe, it, expect, beforeEach } from "@rstest/core"

import { DeployModuleUseCase } from "@app/ports/use-cases/deploy-module"

import { createDeployModuleHandler } from "@infra/http/factories/deploy-module-handler"

import { EntryPoint } from "@app/value-objects/entry-point"
import { EnvironmentType } from "@domain/environment"

describe("Deploy Module Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 201 and entry point data when valid command is provided", async () => {
		const mockEntryPoint: EntryPoint = {
			moduleId: "module-123",
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}

		const mockUseCase: DeployModuleUseCase = {
			execute: async () => mockEntryPoint,
		}

		handler = createDeployModuleHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "project-123",
				moduleId: "module-123",
				moduleType: "FRONTEND",
				versionControlId: "version-456",
				environmentType: "DEV",
				setAsEntryPoint: true,
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(201)

		const body = JSON.parse(result.body)

		expect(body.moduleId).toBe("module-123")
		expect(body.assetBaseUrl).toBe("https://assets.example.com")
		expect(body.publicAppUrl).toBe("https://app.example.com")
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: DeployModuleUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createDeployModuleHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 400 when required fields are missing", async () => {
		const mockUseCase: DeployModuleUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createDeployModuleHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "project-123",
				// Missing moduleId, moduleType, versionControlId, environmentType
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBeDefined()
	})

	it("returns 400 when moduleType is invalid", async () => {
		const mockUseCase: DeployModuleUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createDeployModuleHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "project-123",
				moduleId: "module-123",
				moduleType: "INVALID",
				versionControlId: "version-456",
				environmentType: "DEV",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBeDefined()
	})

	it("returns 400 when environmentType is invalid", async () => {
		const mockUseCase: DeployModuleUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createDeployModuleHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "project-123",
				moduleId: "module-123",
				moduleType: "FRONTEND",
				versionControlId: "version-456",
				environmentType: "INVALID",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBeDefined()
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: DeployModuleUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createDeployModuleHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "project-123",
				moduleId: "module-123",
				moduleType: "FRONTEND",
				versionControlId: "version-456",
				environmentType: "DEV",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})

	it("returns 201 when setAsEntryPoint is false", async () => {
		const mockEntryPoint: EntryPoint = {
			moduleId: "module-789",
			assetBaseUrl: "https://assets.test.com",
			publicAppUrl: "https://app.test.com",
		}

		const mockUseCase: DeployModuleUseCase = {
			execute: async () => mockEntryPoint,
		}

		handler = createDeployModuleHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "project-789",
				moduleId: "module-789",
				moduleType: "FRONTEND",
				versionControlId: "version-789",
				environmentType: "PROD",
				setAsEntryPoint: false,
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(201)

		const body = JSON.parse(result.body)

		expect(body.moduleId).toBe("module-789")
	})
})
