import { DeploymentTarget } from "@domain/deployment-target"
import { CloudServiceMapper, CloudServiceRecord } from "./cloud-service-mapper"

export type DeploymentTargetRecord = {
	moduleId: string
	versionControlId: string
	service: CloudServiceRecord
}

export class DeploymentTargetMapper {
	static toRecord(target: DeploymentTarget): DeploymentTargetRecord {
		return {
			moduleId: target.getModuleId(),
			versionControlId: target.getVersionControlId(),
			service: CloudServiceMapper.toRecord(target.getTargetService()),
		}
	}

	static toDomain(record: DeploymentTargetRecord): DeploymentTarget {
		const service = CloudServiceMapper.toDomain(record.service)
		return new DeploymentTarget(record.moduleId, record.versionControlId, service)
	}

	static toDomains(records: DeploymentTargetRecord[]): DeploymentTarget[] {
		return records.map((record) => this.toDomain(record))
	}
}
