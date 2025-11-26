import { DeploymentExecution, DeploymentStatus } from "@domain/entities/deployment-execution"


export class ProjectDeployment {
    
    readonly id: string
    readonly versionControlId: string
    readonly devEnvironment: Environment
    readonly prodEnvironment: Environment | null
    readonly deployments: DeploymentExecution[]
  
    private constructor(id: string, versionControlId: string, devEnvironment: Environment, prodEnvironment: Environment | null) {
        this.id = id
        this.versionControlId = versionControlId
        this.devEnvironment = devEnvironment
        this.prodEnvironment = prodEnvironment
        this.deployments = []
    }

    startDeployToDev(versionId: string){
        const deployment = DeploymentExecution.create(this.devEnvironment, versionId)
        this.deployments.push(deployment)
        return deployment
    }

    finishDeployment(deployment: DeploymentExecution){
        const startedDeployment = this.deployments.find(d => d.id == deployment.id)
		if (!startedDeployment) {
			throw Error('Deployment doesnt belong to this project')
		}

        if(startedDeployment.status!=DeploymentStatus.IN_PROGRESS){
            throw Error('Deployment is already finished')
        }
        
    }
  
}
  

