import { Service } from "@domain/entities/service"

export class Application {
    readonly id: string
    readonly projectId: string
    services: Service[]
  
    constructor(id: string, projectId: string) {
        this.id = id
        this.projectId = projectId
        this.services = []
    }
  
    addService(service: Service) {
        this.services.push(service)
    }
}
  