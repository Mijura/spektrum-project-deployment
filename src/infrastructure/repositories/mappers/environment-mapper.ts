import { Environment, EnvironmentType } from "@domain/environment"
import { DeploymentTargetMapper, DeploymentTargetRecord } from "./deployment-target-mapper"
import { CloudServiceMapper } from "./cloud-service-mapper"

export type EnvironmentRecord = {
	type: EnvironmentType
	deploymentTargets: DeploymentTargetRecord[]
	entryPoint: string | null
}

export class EnvironmentMapper {
	static toRecord(env: Environment): EnvironmentRecord {
		const entryPoint = env.getEntryPoint()
		return {
			type: env.getType(),
			deploymentTargets: env.deploymentTargets.map((target) => DeploymentTargetMapper.toRecord(target)),
			entryPoint: entryPoint ? entryPoint.getModuleId() : null,
		}
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
