
export class DeploymentTarget<Service> {
    readonly id: string
    private moduleId: string
    private versionControlId: string
    private service: Service
  
    constructor(id: string, moduleId: string, versionControlId: string, service: Service) {
        this.id = id
        this.moduleId = moduleId
        this.versionControlId = versionControlId
        this.service = service
    }

    updateService(service: Service){
        this.service = service
    }

    getModuleId(){
        return this.moduleId
    }

    getVersionControlId(){
        return this.versionControlId
    }

    getTargetService(){
        return this.service
    }
}