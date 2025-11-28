
export interface DeployToDev {
    execute(moduleId: string): Promise<void>
}