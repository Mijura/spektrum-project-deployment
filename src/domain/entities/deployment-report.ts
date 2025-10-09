export enum DeploymentStatus {
    PENDING = "Pending",
    SUCCESS = "Success",
    FAILED = "Failed"
}
  
export class DeploymentReport {
    readonly id: string
    readonly version: string
    readonly created: string
    serviceId: string
    status: DeploymentStatus
  
    constructor(id: string, version: string, serviceId: string) {
        this.id = id
        this.version = version
        this.created = new Date().toISOString()
        this.serviceId = serviceId
        this.status = DeploymentStatus.PENDING
    }
}