import { Url } from "url"

export enum EnvironmentType {
    'DEVELOPMENT',
    'PRODUCTION'
}

class Environment {
    constructor(
      readonly type: EnvironmentType,
      readonly endpoint: Url,
    ) {}
}

export class DevEnvironment extends Environment {

    constructor(endpoint: Url){
        super(EnvironmentType.DEVELOPMENT, endpoint)
    }

}

export class ProdEnvironment extends Environment {

    constructor(endpoint: Url){
        super(EnvironmentType.PRODUCTION, endpoint)
    }
}