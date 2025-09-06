import { DeploymentStrategy } from "@domain/ports/deployment-strategy"
import { Environment } from "@domain/entities/environment"

export enum ServiceType {
    FRONTEND = "Frontend",
    BACKEND = "Backend",
}

export abstract class Service {
    readonly id: string
    readonly type: ServiceType
    readonly repositoryId: string
    readonly environments: Environment[]
  
    constructor(id: string, type: ServiceType, repositoryId: string) {
        this.id = id
        this.type = type
        this.repositoryId = repositoryId
        this.environments = []
    }
  
    addEnvironment(env: Environment) {
        this.environments.push(env)
    }
  
    deployOnEnvironment(environmentId: string, strategy: DeploymentStrategy): void { 
        const deployment = strategy.deploy(this)

    }
}
  
export class Frontend extends Service {

    constructor(id: string, repositoryId: string) {
        super(id, ServiceType.FRONTEND, repositoryId)
    }

}
  
export class Backend extends Service {
    
    constructor(id: string, repositoryId: string) {
        super(id, ServiceType.BACKEND, repositoryId)
    }
}
  