import { CloudProfileRepository } from "@app/ports/repositories/project-cloud-profile-repository"
import { ProjectCloudProfile } from "@domain/project-cloud-profile"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
import {
	ProjectCloudProfileMapper,
	ProjectCloudProfileRecord,
} from "@infra/repositories/mappers/project-cloud-profile-mapper"

export class DynamoDBCloudProfileRepository implements CloudProfileRepository {
	private readonly docClient: DynamoDBDocumentClient
	private readonly tableName: string

	constructor() {
		const client = new DynamoDBClient({})
		this.docClient = DynamoDBDocumentClient.from(client)
		this.tableName = process.env.PROJECT_CLOUD_PROFILE || "ProjectCloudProfile"
	}

	async save(profile: ProjectCloudProfile): Promise<void> {
		const record = ProjectCloudProfileMapper.toRecord(profile)

		await this.docClient.send(
			new PutCommand({
				TableName: this.tableName,
				Item: record as any,
			}),
		)
	}

	async getByProjectId(projectId: string): Promise<ProjectCloudProfile | undefined> {
		const result = await this.docClient.send(
			new GetCommand({
				TableName: this.tableName,
				Key: { projectId },
			}),
		)

		if (!result.Item) {
			return undefined
		}

		return ProjectCloudProfileMapper.toDomain(result.Item as ProjectCloudProfileRecord)
	}
}
