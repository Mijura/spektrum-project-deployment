import { Environment, EnvironmentType } from "@domain/environment"

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

    updateEnvironment(environment: Environment): void {
        const index = this.environments.findIndex(env => env.getType() == environment.getType())
        if (index !== -1) {
            this.environments[index] = environment
        }
    }

    static rehydrate(projectId: string, environments: Environment[]): ProjectCloudProfile {
        return new ProjectCloudProfile(projectId, environments)
    }

    getEnvironment(type: EnvironmentType): Environment | undefined {
        return this.environments.find(env => env.getType() == type)
    }
    
    getEnvironments(): Environment[] {
        return [...this.environments]
    }
}
  

