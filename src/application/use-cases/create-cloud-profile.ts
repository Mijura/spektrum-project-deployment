import { CreateCloudProfileUseCase } from "@app/ports/use-cases/create-cloud-profile"
import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"

export class CreateCloudProfile implements CreateCloudProfileUseCase {
	constructor(private cloudProfileRepo: CloudProfileRepository) {}

	async execute(projectId: string): Promise<void> {
		const profile = await this.cloudProfileRepo.getByProjectId(projectId)

		if (profile) {
			throw new Error("Cloud Profile for given project already exists")
		}

		const newProfile = ProjectCloudProfile.create(projectId)
		await this.cloudProfileRepo.save(newProfile)
	}
}
