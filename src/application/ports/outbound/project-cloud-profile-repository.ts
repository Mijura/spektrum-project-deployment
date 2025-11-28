import { ProjectCloudProfile } from "@domain/entities/project-cloud-profile"

export interface CloudProfileRepository {
    save(profile: ProjectCloudProfile): void
    getByProjectId(projectId: string): ProjectCloudProfile
}