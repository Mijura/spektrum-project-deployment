import { CloudService } from "./target-service"

export class DeploymentTarget {
	private moduleId: string
	private versionControlId: string
	private service: CloudService

	constructor(moduleId: string, versionControlId: string, service: CloudService) {
		this.moduleId = moduleId
		this.versionControlId = versionControlId
		this.service = service
	}

	updateService(service: CloudService): void {
		this.service = service
	}

	getModuleId(): string {
		return this.moduleId
	}

	getVersionControlId(): string {
		return this.versionControlId
	}

	getTargetService(): CloudService {
		return this.service
	}
}
