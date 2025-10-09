import { DeploymentProvider } from "@domain/ports/deployment-provider"
import { DeploymentReport } from "./deployment-report"

export enum ServiceType {
    FRONTEND = "Frontend",
    BACKEND = "Backend",
}

export abstract class Service {
    readonly id: string
    readonly type: ServiceType
    readonly repositoryId: string
  
    constructor(id: string, type: ServiceType, repositoryId: string) {
        this.id = id
        this.type = type
        this.repositoryId = repositoryId
    }
  
    abstract deployWith(provider: DeploymentProvider): DeploymentReport
}
  
export class Frontend extends Service {

    constructor(id: string, repositoryId: string) {
        super(id, ServiceType.FRONTEND, repositoryId)
    }

    deployWith(provider: DeploymentProvider): DeploymentReport {
        return provider.deployFrontend(this)
    }

}
  
export class BackendService extends Service {
    
    constructor(id: string, repositoryId: string) {
        super(id, ServiceType.BACKEND, repositoryId)
    }

    deployWith(provider: DeploymentProvider): DeploymentReport {
        return provider.deployBackend(this)
    }
}
  