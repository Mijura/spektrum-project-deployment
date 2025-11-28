import { DeploymentLog } from "@domain/entities/deployment-log"
import { DeploymentTarget } from "@domain/entities/deployment-target"
import { v4 as uuidv4 } from 'uuid'
import { Service } from "./target-service"

export enum EnvironmentType {
    DEV,
    PROD
}

export class Environment {

    private constructor(
        private type: EnvironmentType,
        readonly deploymentTargets: DeploymentTarget<Service> [],
        readonly logs: DeploymentLog [],
        private entryPointTargetId: string | undefined
    ) {}

    addLog(log: DeploymentLog){
        this.logs.push(log)
    }

    static create(type: EnvironmentType): Environment {
        return new Environment(type, [], [], undefined)
    }


    /** ensure there is a target for this module, create if missing */
    ensureDeploymentTarget(moduleId: string, versionControlId: string, service: Service): DeploymentTarget<Service> {
        let target = this.deploymentTargets.find(t => t.getModuleId() === moduleId)
        if (!target) {
            target = new DeploymentTarget(uuidv4(), moduleId, versionControlId, service)
            this.deploymentTargets.push(target)
        } else {
            // optional: update service config if e.g. bucket/prefix/url changed
            target.updateService(service)
        }
        return target
    }

    setEntryPoint(targetId: string) {
        const exists = this.deploymentTargets.some(t => t.id === targetId)

        if (!exists) 
            throw new Error("Entry point target must exist in this environment")
        
        this.entryPointTargetId = targetId
    }

    getEntryPoint(): DeploymentTarget<Service> | undefined {
        if (!this.entryPointTargetId) return undefined
        return this.deploymentTargets.find(t => t.id === this.entryPointTargetId)
    }

    getType(){
        return this.type
    }


}