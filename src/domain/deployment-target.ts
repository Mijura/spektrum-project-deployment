import { S3 } from "./service/s3"
import { v4 as uuidv4 } from "uuid"

/**
 * A DeploymentTarget is a module that is deployed to a cloud service.
 * It contains the module id, revision id, folder name, and service.
 * The module id is the id of the module that is being deployed.
 * The revision id is the id of the revision that is being deployed.
 * The folder name is the name of the folder where the module is deployed.
 * The service is the cloud service that the module is being deployed to.
 */
export class DeploymentTarget {

	private folderName: string
	private moduleId: string
	private revisionId: string
	private service: S3

	private constructor(moduleId: string, revisionId: string, folderName: string, service: S3) {
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
		return `https://${this.folderName}.${this.service.cloudFrontDomain}`
	}

	getAssetBaseUrl(): string {
		return `${this.service.bucketWebsiteEndpoint}/${this.folderName}`
	}

	getFolderName(): string {
		return this.folderName
	}

	getService(): S3 {
		return this.service
	}

	static create(moduleId: string, revisionId: string, service: S3): DeploymentTarget {
		const folderName = uuidv4()
		return new DeploymentTarget(moduleId, revisionId, folderName, service)
	}

	static rehydrate(data: {
		moduleId: string
		revisionId: string
		folderName: string
		service: S3
	}): DeploymentTarget {
		return new DeploymentTarget(data.moduleId, data.revisionId, data.folderName, data.service)
	}
}
