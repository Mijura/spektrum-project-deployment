import { CloudProfileRepository } from "@app/ports/outbound/project-cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/entities/project-cloud-profile"

export class DynamoDBCloudProfileRepository implements CloudProfileRepository {

    save(profile: ProjectCloudProfile): void {
        throw new Error("Method not implemented.")
    }
    getByProjectId(projectId: string): ProjectCloudProfile {
        throw new Error("Method not implemented.")
    }
    
}