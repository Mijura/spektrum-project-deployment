import { DeploymentLog } from "@domain/entities/deployment-log"
import { DeploymentTarget } from "@domain/value-objects/deployment-target"
import { CloudService } from "@domain/value-objects/target-service"

export enum EnvironmentType {
    DEV = "DEV",
    PROD = "PROD"
}

export class Environment {

    private constructor(
        private type: EnvironmentType,
        readonly deploymentTargets: DeploymentTarget [],
        readonly logs: DeploymentLog [],
        private entryPoint: string | undefined
    ) {}

    addLog(log: DeploymentLog){
        this.logs.push(log)
    }

    static create(type: EnvironmentType): Environment {
        return new Environment(type, [], [], undefined)
    }

    /** ensure there is a target for this module, create if missing */
    ensureDeploymentTarget(moduleId: string, versionControlId: string, service: CloudService): DeploymentTarget {
        let target = this.deploymentTargets.find(t => t.getModuleId() === moduleId)
        if (!target) {
            target = new DeploymentTarget(moduleId, versionControlId, service)
            this.deploymentTargets.push(target)
        } else {
            // optional: update service config if e.g. bucket/prefix/url changed
            target.updateService(service)
        }
        return target
    }

    addDeploymentTarget(target: DeploymentTarget): void {
        this.deploymentTargets.push(target)
    }

    setEntryPoint(moduleId: string) {
        const exists = this.deploymentTargets.some(t => t.getModuleId() === moduleId)

        if (!exists) 
            throw new Error("Entry point target must exist in this environment")
        
        this.entryPoint = moduleId
    }

    getEntryPoint(): DeploymentTarget | undefined {
        if (!this.entryPoint) 
            return undefined
        return this.deploymentTargets.find(t => t.getModuleId() === this.entryPoint)
    }

    getType(){
        return this.type
    }


}