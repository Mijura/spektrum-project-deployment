import { Environment, EnvironmentType } from "@domain/environment"
import { DeploymentTargetMapper, DeploymentTargetRecord } from "./deployment-target-mapper"
import { DeploymentLogMapper, DeploymentLogRecord } from "./deployment-log-mapper"
import { CloudServiceMapper } from "./cloud-service-mapper"

export type EnvironmentRecord = {
	type: EnvironmentType
	deploymentTargets: DeploymentTargetRecord[]
	logs: DeploymentLogRecord[]
	entryPoint?: string
}

export class EnvironmentMapper {
	static toRecord(env: Environment): EnvironmentRecord {
		const record: EnvironmentRecord = {
			type: env.getType(),
			deploymentTargets: env.deploymentTargets.map((target) => DeploymentTargetMapper.toRecord(target)),
			logs: env.logs.map((log) => DeploymentLogMapper.toRecord(log)),
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
			env.ensureDeploymentTarget(targetData.moduleId, targetData.versionControlId, service)
		})

		// Add logs
		record.logs.forEach((logData) => {
			const log = DeploymentLogMapper.toDomain(logData)
			env.addLog(log)
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
