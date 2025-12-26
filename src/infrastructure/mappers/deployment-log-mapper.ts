import { DeploymentLog, DeploymentStatus } from "@domain/entities/deployment-log"

export type DeploymentLogRecord = {
	id: string
	versionId: string
	startedAt: string
	finishedAt: string | null
	status: DeploymentStatus
}

export class DeploymentLogMapper {
	static toRecord(log: DeploymentLog): DeploymentLogRecord {
		return {
			id: log.id,
			versionId: log.versionId,
			startedAt: log.startedAt,
			finishedAt: log.finishedAt,
			status: log.status,
		}
	}

	static toDomain(record: DeploymentLogRecord): DeploymentLog {
		return DeploymentLog.rehydrate({
			id: record.id,
			versionId: record.versionId,
			startedAt: record.startedAt,
			finishedAt: record.finishedAt,
			status: record.status,
		})
	}

	static toDomains(records: DeploymentLogRecord[]): DeploymentLog[] {
		return records.map((record) => this.toDomain(record))
	}
}

