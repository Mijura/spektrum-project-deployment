import { Environment, EnvironmentType } from "@domain/environment"
import { DeploymentTargetMapper, DeploymentTargetRecord } from "./deployment-target-mapper"
import { CloudServiceMapper } from "./cloud-service-mapper"
import { DeploymentTarget } from "@domain/deployment-target"

export type EnvironmentRecord = {
	type: EnvironmentType
	deploymentTargets: DeploymentTargetRecord[]
	entryPoint?: string
}

export class EnvironmentMapper {
	static toRecord(env: Environment): EnvironmentRecord {
		const record: EnvironmentRecord = {
			type: env.getType(),
			deploymentTargets: env.deploymentTargets.map((target) => DeploymentTargetMapper.toRecord(target)),
		}

		const entryPoint = env.getEntryPoint()
		if (entryPoint) {
			record.entryPoint = entryPoint.getModuleId()
		}

		return record
	}

	static toDomain(record: EnvironmentRecord): Environment {
		const env = Environment.create(record.type)

		// Add deployment targets
		record.deploymentTargets.forEach((targetData) => {
			const service = CloudServiceMapper.toDomain(targetData.service)
			const deploymentTarget = DeploymentTargetMapper.toDomain({
				moduleId: targetData.moduleId,
				revisionId: targetData.revisionId,
				folderName: targetData.folderName,
				service: service,
			})
			env.addDeploymentTarget(deploymentTarget)
		})

		// Set entry point if exists
		if (record.entryPoint) {
			env.setEntryPoint(record.entryPoint)
		}

		return env
	}

	static toDomains(records: EnvironmentRecord[]): Environment[] {
		return records.map((record) => this.toDomain(record))
	}
}
