import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"

export class MockCloudProfileRepository implements CloudProfileRepository {
	private profiles: Map<string, ProjectCloudProfile> = new Map()

	async save(profile: ProjectCloudProfile): Promise<void> {
		this.profiles.set(profile.projectId, profile)
	}

	async getByProjectId(projectId: string): Promise<ProjectCloudProfile | undefined> {
		return this.profiles.get(projectId)
	}

	clear(): void {
		this.profiles.clear()
	}

	getAllProfiles(): ProjectCloudProfile[] {
		return Array.from(this.profiles.values())
	}
}
