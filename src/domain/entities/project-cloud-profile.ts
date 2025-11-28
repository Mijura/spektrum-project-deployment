import { Environment, EnvironmentType } from "@domain/value-objects/environment"
import { v4 as uuidv4 } from "uuid"

export class ProjectCloudProfile {
    
    readonly id: string
    readonly projectId: string
    private readonly environments: Environment[]
  
    private constructor(id: string, projectId: string, environments: Environment[]) {
        this.id = id
        this.projectId = projectId
        this.environments = environments
    }

    static create(projectId: string){
        const id = uuidv4()
        const devEnv = Environment.create(EnvironmentType.DEV)
        const prodEnv = Environment.create(EnvironmentType.PROD)
        return new ProjectCloudProfile(id, projectId, [devEnv, prodEnv])
    }

    getEnvironment(type: EnvironmentType): Environment | undefined {
        return this.environments.find(env => env.getType() == type)
    }
    
    getEnvironments(): Environment[] {
        return [...this.environments]
    }
}
  

