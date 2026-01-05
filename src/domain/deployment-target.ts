import { S3 } from "./service/s3"

export class DeploymentTarget {

	private moduleId: string
	private revisionId: string
	private folderName: string
	private service: S3

	constructor(moduleId: string, revisionId: string, folderName: string, service: S3) {
		this.moduleId = moduleId
		this.revisionId = revisionId
		this.folderName = folderName
		this.service = service
	}

	updateService(service: S3): void {
		this.service = service
	}

	getModuleId(): string {
		return this.moduleId
	}

	getRevisionId(): string {
		return this.revisionId
	}

	getPublicAppUrl(): string {
		return `${this.folderName}.${this.service.cloudFrontDomain}`
	}

	getAssetBaseUrl(): string {
		return `${this.service.bucketWebsiteEndpoint}/${this.folderName}`
	}
}
