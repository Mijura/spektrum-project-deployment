import { ProjectCloudProfile } from "@domain/entities/project-cloud-profile"
import { EnvironmentMapper, EnvironmentRecord } from "./environment-mapper"

export type ProjectCloudProfileRecord = {
	projectId: string
	environments: EnvironmentRecord[]
}

export class ProjectCloudProfileMapper {
	static toRecord(profile: ProjectCloudProfile): ProjectCloudProfileRecord {
		return {
			projectId: profile.projectId,
			environments: profile.getEnvironments().map((env) =>
				EnvironmentMapper.toRecord(env)
			),
		}
	}

	static toDomain(record: ProjectCloudProfileRecord): ProjectCloudProfile {
		const environments = EnvironmentMapper.toDomains(record.environments)
		return ProjectCloudProfile.rehydrate(record.projectId, environments)
	}

	static toDomains(records: ProjectCloudProfileRecord[]): ProjectCloudProfile[] {
		return records.map((record) => this.toDomain(record))
	}
}

