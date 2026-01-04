import { DeploymentLog } from "@domain/deployment-log"
import { DeploymentTarget } from "@domain/deployment-target"

export enum EnvironmentType {
	DEV = "DEV",
	PROD = "PROD",
}

export class Environment {
	private constructor(
		private type: EnvironmentType,
		readonly deploymentTargets: DeploymentTarget[],
		readonly logs: DeploymentLog[],
		private entryPoint: string | undefined,
	) {}

	addLog(log: DeploymentLog) {
		this.logs.push(log)
	}

	static create(type: EnvironmentType): Environment {
		return new Environment(type, [], [], undefined)
	}

	updateDeploymentTarget(target: DeploymentTarget): void {
		const index = this.deploymentTargets.findIndex((t) => t.getModuleId() === target.getModuleId())
		if (index !== -1) {
			this.deploymentTargets[index] = target
		}
	}

	getDeploymentTarget(moduleId: string): DeploymentTarget | undefined {
		return this.deploymentTargets.find((t) => t.getModuleId() === moduleId)
	}

	addDeploymentTarget(target: DeploymentTarget): void {
		this.deploymentTargets.push(target)
	}

	setEntryPoint(moduleId: string) {
		const exists = this.deploymentTargets.some((t) => t.getModuleId() === moduleId)

		if (!exists) throw new Error("Entry point target must exist in this environment")

		this.entryPoint = moduleId
	}

	getEntryPoint(): DeploymentTarget | undefined {
		if (!this.entryPoint) 
			return undefined
		return this.deploymentTargets.find((t) => t.getModuleId() === this.entryPoint)
	}

	getType() {
		return this.type
	}
}
