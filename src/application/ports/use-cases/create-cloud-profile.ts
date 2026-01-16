export interface CreateCloudProfileUseCase {
	execute(projectId: string): Promise<void>
}
