import { Version } from "@app/value-objects/version"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export interface VersionControlService {
	pull(repositoryId: string, auth: Auth<UserData>): Promise<Version>
}
