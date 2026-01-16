import { Version } from "@app/value-objects/version"

export interface VersionControlService {
	pull(repositoryId: string): Promise<Version>
}
