import { v4 as uuidv4 } from 'uuid'

export enum DeploymentStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED",
}

export class DeploymentLog {

    readonly id: string
    readonly versionId: string
    readonly startedAt: string
    finishedAt: string | null
    status: DeploymentStatus
  
    private constructor(
        id: string,
        versionId: string,
        startedAt: string,
        finishedAt: string | null,
        status: DeploymentStatus
    ) {
        this.id = id,
        this.versionId = versionId
        this.startedAt = startedAt
        this.finishedAt = finishedAt
        this.status = status
    }

    setFinalStatus(status: DeploymentStatus.FAILED | DeploymentStatus.SUCCEEDED): void {

        if(this.status !== DeploymentStatus.IN_PROGRESS)
            throw new Error(`You can only change in progress status`)

        
        this.finishedAt = new Date().toISOString()
        this.status = status
    }

    static create(versionId: string){
        const id = uuidv4()
        const startedAt = new Date().toISOString()
        const status = DeploymentStatus.IN_PROGRESS
        
        return new DeploymentLog(id, versionId, startedAt, null, status)
    }
  
    static rehydrate(data: {
        id: string,
        versionId: string
        startedAt: string,
        finishedAt: string | null,
        status: DeploymentStatus
    }) {
        return new DeploymentLog(
            data.id,
            data.versionId,
            data.startedAt,
            data.finishedAt,
            data.status,
        )
    }
}
  