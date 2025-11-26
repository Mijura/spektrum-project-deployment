import { v4 as uuidv4 } from 'uuid'

export enum DeploymentStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED",
}

export class DeploymentExecution {

    readonly id: string
    readonly environment: Environment
    readonly versionId: string
    readonly startedAt: string
    finishedAt: string | null
    status: DeploymentStatus
  
    private constructor(
        id: string,
        environment: Environment,
        versionId: string,
        startedAt: string,
        finishedAt: string | null,
        status: DeploymentStatus
    ) {
        this.id = id,
        this.environment = environment
        this.versionId = versionId
        this.startedAt = startedAt
        this.finishedAt = finishedAt
        this.status = status
    }

    static create(environment: Environment, versionId: string){
        const id = uuidv4()
        const startedAt = new Date().toISOString()
        const status = DeploymentStatus.IN_PROGRESS
        
        return new DeploymentExecution(id, environment, versionId, startedAt, null, status)
    }

    finish(status: Exclude<DeploymentStatus.FAILED, DeploymentStatus.SUCCEEDED>): void {
        this.finishedAt = new Date().toISOString()
        this.status = status
    }
  
    static rehydrate(data: {
        id: string,
        environment: Environment
        versionId: string
        startedAt: string,
        finishedAt: string,
        status: DeploymentStatus
    }) {
        return new DeploymentExecution(
            data.id,
            data.environment,
            data.versionId,
            data.startedAt,
            data.finishedAt,
            data.status,
        )
    }
}
  