
export class DeploymentTarget<Service> {
    private moduleId: string
    private versionControlId: string
    private service: Service
  
    constructor(moduleId: string, versionControlId: string, service: Service) {
        this.moduleId = moduleId
        this.versionControlId = versionControlId
        this.service = service
    }

    updateService(service: Service): void {
        this.service = service
    }

    getModuleId(): string {
        return this.moduleId
    }

    getVersionControlId(): string {
        return this.versionControlId
    }

    getTargetService(): Service {
        return this.service
    }
}