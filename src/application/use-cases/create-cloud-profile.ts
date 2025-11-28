import { CreateCloudProfile } from "@app/ports/inbound/create-cloud-profile"
import { CloudProfileRepository } from "@app/ports/outbound/project-cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/entities/project-cloud-profile"

export class CreateCloudProfileUseCase implements CreateCloudProfile {

    constructor(private cloudProfileRepo: CloudProfileRepository){}

    async execute(projectId: string): Promise<void> {
        const profile = await this.cloudProfileRepo.getByProjectId(projectId)

        if(profile){
            throw new Error('Cloud Profile for given project already exists')
        }

        const newProfile = ProjectCloudProfile.create(projectId)
        await this.cloudProfileRepo.save(newProfile)
    }

}