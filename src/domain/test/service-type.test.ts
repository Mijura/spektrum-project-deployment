import { describe, it, expect } from "@rstest/core"
import { ServiceType } from "@domain/service/service-type"

describe("ServiceType", () => {
	it("should have S3 service type", () => {
		expect(ServiceType.S3).toBe("S3")
	})

	it("should be an enum with string values", () => {
		expect(typeof ServiceType.S3).toBe("string")
	})
})
