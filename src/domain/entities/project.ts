import { DevEnvironment, ProdEnvironment } from "@domain/value-objects/environment"
import { Url } from "@domain/value-objects/url"

export enum ProjectType {
    FRONTEND,
    BACKEND
}

export class Project {
    
    readonly id: string
    readonly repository: Url
    readonly type: ProjectType
    readonly devEnvironment: DevEnvironment
    readonly prodEnvironment: ProdEnvironment | null
  
    private constructor(id: string, repository: Url, devEnvironment: DevEnvironment, prodEnvironment: ProdEnvironment | null) {
        this.id = id
        this.repository = repository
        this.devEnvironment = devEnvironment
        this.prodEnvironment = prodEnvironment
    }
  
}
  

