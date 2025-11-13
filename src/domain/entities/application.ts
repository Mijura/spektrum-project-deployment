import { Environment } from "./environment"

export class Application {

    readonly id: string
    readonly projectId: string
    readonly environments: Environment[]
  
    constructor(id: string, projectId: string) {
        this.id = id
        this.projectId = projectId
        this.environments = []
    }    
    
    addEnvironment(env: Environment) {
        this.environments.push(env)
    }
  
}
  