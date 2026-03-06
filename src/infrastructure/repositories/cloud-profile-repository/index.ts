import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { DynamoDBCloudProfileRepository } from "./cloud-profile-repository"

export const cloudProfileRepo: CloudProfileRepository = new DynamoDBCloudProfileRepository()
