
export interface DeployToProd {
    execute(projectHistoryId: string): Promise<void>
}