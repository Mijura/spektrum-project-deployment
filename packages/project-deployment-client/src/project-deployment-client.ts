import axios from "axios"

export enum EnvironmentType {
    DEV,
    PROD
}

export enum ModuleType {
    FRONTEND
}

export type DeployModuleCommand = {
    projectId: string
    moduleId: string
    moduleType: ModuleType
    versionControlId: string
    environmentType: EnvironmentType
    setAsEntryPoint?: boolean
}

export class ProjectDeploymentClient {

    private readonly endpoint: string

    constructor(endpoint: string){
        this.endpoint = endpoint
    }

    async createCloudProfile(projectId: string): Promise<void>{

        try {

            const payload = {
                projectId: projectId
            }
    
            await axios.post(
                `${this.endpoint}/project-cloud-profile`,
                payload
            )

		} catch (error) {
			console.error("Error creating cloud profile:", error)
			throw error
		}
        
    }

    async deployModule(deployModuleCommand: DeployModuleCommand): Promise<void>{

        try {

			await axios.post(
				`${this.endpoint}/deploy-module`,
				deployModuleCommand
			)

		} catch (error) {
			console.error("Error during deploying module:", error)
			throw error
		}
    }

    async getEntryPoint(projectId: string, environment: EnvironmentType): Promise<{
        moduleId: string
        assetBaseUrl: string
        publicAppUrl: string
    }> {

        try {

            const environmentKey = EnvironmentType[environment] as string

            const response = await axios.get(
                `${this.endpoint}/projects/${projectId}/environments/${environmentKey}/entry-point`
            )

            return response.data

		} catch (error) {
			console.error("Error getting entry point:", error)
			throw error
		}
    }
}