
export enum EnvironmentType {
    'DEVELOPMENT',
    'PRODUCTION'
}

class Environment {
    constructor(
      readonly type: EnvironmentType,
      readonly endpoint: string,
    ) {}
}

export class DevEnvironment extends Environment {

    constructor(endpoint: string){
        super(EnvironmentType.DEVELOPMENT, endpoint)
    }

}

export class ProdEnvironment extends Environment {

    constructor(endpoint: string){
        super(EnvironmentType.PRODUCTION, endpoint)
    }
}