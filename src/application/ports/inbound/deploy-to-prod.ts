
export interface DeployToProd {
    execute(moduleId: string): Promise<void>
}