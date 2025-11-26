import { Environment } from "@domain/value-objects/environment"
import { v4 as uuidv4 } from "uuid"

export class ProjectInfra {
    
    readonly id: string
    readonly versionControlId: string
    readonly devEnvironment: Environment
    readonly prodEnvironment: Environment
  
    private constructor(id: string, versionControlId: string, devEnvironment: Environment, prodEnvironment: Environment) {
        this.id = id
        this.versionControlId = versionControlId
        this.devEnvironment = devEnvironment
        this.prodEnvironment = prodEnvironment
    }

  
    create(versionControlId: string){
        const id = uuidv4()
        const devEnvironment = Environment.create()
        const prodEnvironment = Environment.create()
        return new ProjectInfra(id, versionControlId, devEnvironment, prodEnvironment)
    }
}
  

