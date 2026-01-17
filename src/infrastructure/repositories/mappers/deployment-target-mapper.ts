import { DeploymentTarget } from "@domain/deployment-target"
import { CloudServiceMapper, S3Record } from "./cloud-service-mapper"

export type DeploymentTargetRecord = {
	moduleId: string
	revisionId: string
	service: S3Record
	folderName: string
}

export class DeploymentTargetMapper {
	static toRecord(target: DeploymentTarget): DeploymentTargetRecord {
		return {
			moduleId: target.getModuleId(),
			revisionId: target.getRevisionId(),
			folderName: target.getFolderName(),
			service: CloudServiceMapper.toRecord(target.getService()),
		}
	}

	static toDomain(record: DeploymentTargetRecord): DeploymentTarget {
		const service = CloudServiceMapper.toDomain(record.service)
		return DeploymentTarget.rehydrate({
			moduleId: record.moduleId,
			revisionId: record.revisionId,
			folderName: record.folderName,
			service: service,
		})
	}

	static toDomains(records: DeploymentTargetRecord[]): DeploymentTarget[] {
		return records.map((record) => this.toDomain(record))
	}
}
