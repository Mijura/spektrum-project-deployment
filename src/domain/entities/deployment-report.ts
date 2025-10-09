export enum DeploymentStatus {
    PENDING = "Pending",
    SUCCESS = "Success",
    FAILED = "Failed"
}
  
export class DeploymentReport {
    readonly id: string
    readonly version: string
    readonly created: string
    status: DeploymentStatus
    url: string | null
  
    constructor(id: string, version: string) {
        this.id = id
        this.version = version
        this.created = new Date().toISOString()
        this.status = DeploymentStatus.PENDING
        this.url = null
    }
}