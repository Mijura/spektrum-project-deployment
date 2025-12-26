import { ProjectCloudProfile } from "@domain/entities/project-cloud-profile"

export interface CloudProfileRepository {
    save(profile: ProjectCloudProfile): Promise<void>
    getByProjectId(projectId: string): Promise<ProjectCloudProfile | undefined>
}