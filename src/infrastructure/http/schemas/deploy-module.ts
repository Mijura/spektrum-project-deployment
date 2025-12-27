

export const schema = {
	type: "object",
	required: ["projectId", "moduleId", "moduleType", "versionControlId", "environmentType"],
	properties: {
		projectId: {
			type: "string",
		},
        moduleId: {
			type: "string",
		},
        moduleType: {
			type: "string",
			enum: ["FRONTEND"]
		},
        versionControlId: {
			type: "string",
		},
        environmentType: {
            type: "string",
			enum: ["DEV", "PROD"]
        },
        setAsEntryPoint: {
			type: "boolean"
        }
	},
}

