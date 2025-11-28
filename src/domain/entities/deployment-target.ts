import { TargetService } from "@domain/value-objects/target-service"

export class DeploymentTarget {
    readonly id: string
    private moduleId: string
    private service: TargetService
  
    constructor(id: string, moduleId: string, service: TargetService) {
        this.id = id
        this.moduleId = moduleId
        this.service = service
    }

    updateService(service: TargetService){
        this.service = service
    }

    getModuleId(){
        return this.moduleId
    }

    getTargetService(){
        return this.service
    }
}