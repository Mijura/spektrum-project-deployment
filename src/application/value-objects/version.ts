import { FileArtifacts } from "./file-artifacts"

export type Version = {
	repositoryId: string
	buildArtifacts: FileArtifacts
	sourceCodeArtifacts: FileArtifacts
}
