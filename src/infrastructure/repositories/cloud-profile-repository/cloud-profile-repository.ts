import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
import {
	ProjectCloudProfileMapper,
	ProjectCloudProfileRecord,
} from "@infra/repositories/mappers/project-cloud-profile-mapper"

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

export class DynamoDBCloudProfileRepository implements CloudProfileRepository {
	async save(profile: ProjectCloudProfile): Promise<void> {
		const tableName = process.env.PROJECT_CLOUD_PROFILE
		const record = ProjectCloudProfileMapper.toRecord(profile)

		await docClient.send(
			new PutCommand({
				TableName: tableName,
				Item: record as any,
			}),
		)
	}

	async getByProjectId(projectId: string): Promise<ProjectCloudProfile | undefined> {
		const tableName = process.env.PROJECT_CLOUD_PROFILE
		const result = await docClient.send(
			new GetCommand({
				TableName: tableName,
				Key: { projectId },
			}),
		)

		if (!result.Item) {
			return undefined
		}

		return ProjectCloudProfileMapper.toDomain(result.Item as ProjectCloudProfileRecord)
	}
}
