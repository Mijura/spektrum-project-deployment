import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type CreateCloudProfileParams = {
	projectId: string
}
export type CreateCloudProfileUseCase = AuthenticatedUseCase<UserData, CreateCloudProfileParams, void>