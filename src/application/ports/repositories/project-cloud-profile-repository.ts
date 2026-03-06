import { ProjectCloudProfile } from "@domain/project-cloud-profile"

export interface CloudProfileRepository {
	save(profile: ProjectCloudProfile): Promise<void>
	getByProjectId(projectId: string): Promise<ProjectCloudProfile | undefined>
}
