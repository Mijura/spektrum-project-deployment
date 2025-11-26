
export interface DeployToDev {
    execute(projectHistoryId: string): Promise<void>
}