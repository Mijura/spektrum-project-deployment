
export interface DeployModule {
    execute(moduleId: string): Promise<void>
}