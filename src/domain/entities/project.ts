import { DevEnvironment, ProdEnvironment } from "@domain/value-objects/environment"

export enum ProjectType {
    FRONTEND,
    BACKEND
}

export class Project {
    
    readonly id: string
    readonly projectHistoryId: string
    readonly type: ProjectType
    readonly devEnvironment: DevEnvironment
    readonly prodEnvironment: ProdEnvironment | null
  
    private constructor(id: string, projectHistoryId: string, devEnvironment: DevEnvironment, prodEnvironment: ProdEnvironment | null) {
        this.id = id
        this.projectHistoryId = projectHistoryId
        this.devEnvironment = devEnvironment
        this.prodEnvironment = prodEnvironment
    }
  
}
  

