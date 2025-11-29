import { Environment, EnvironmentType } from "@domain/value-objects/environment"

export class ProjectCloudProfile {
    
    readonly projectId: string
    private readonly environments: Environment[]
  
    private constructor(projectId: string, environments: Environment[]) {
        this.projectId = projectId
        this.environments = environments
    }

    static create(projectId: string){
        const devEnv = Environment.create(EnvironmentType.DEV)
        const prodEnv = Environment.create(EnvironmentType.PROD)
        return new ProjectCloudProfile(projectId, [devEnv, prodEnv])
    }

    getEnvironment(type: EnvironmentType): Environment | undefined {
        return this.environments.find(env => env.getType() == type)
    }
    
    getEnvironments(): Environment[] {
        return [...this.environments]
    }
}
  

