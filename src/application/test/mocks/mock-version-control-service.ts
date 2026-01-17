import { VersionControlService } from "@app/ports/services/version-control-service"
import { Version } from "@app/value-objects/version"

export class MockVersionControlService implements VersionControlService {
	private versions: Map<string, Version> = new Map()

	async pull(repositoryId: string): Promise<Version> {
		const version = this.versions.get(repositoryId)
		if (!version) {
			throw new Error(`No version found for repository: ${repositoryId}`)
		}
		return version
	}

	setVersion(repositoryId: string, version: Version): void {
		this.versions.set(repositoryId, version)
	}

	clear(): void {
		this.versions.clear()
	}
}
