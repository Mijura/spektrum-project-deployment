class Url {
    
    url: string

    constructor(url: string) {
      
        const regex = /^https:\/\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.jigjoy\.io$/i
        const isValid = regex.test(url)

        if(!isValid)
            throw new Error(`URL is not Valid`)
    }

}

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

class DevEnvironment extends Environment {

    constructor(endpoint: Url){
        super(EnvironmentType.DEVELOPMENT, endpoint)
    }

}

class ProdEnvironment extends Environment {

    constructor(endpoint: Url){
        super(EnvironmentType.PRODUCTION, endpoint)
    }
}


export class Project {
    readonly id: string
    readonly repository: Url
    readonly devEnvironment: DevEnvironment
    readonly prodEnvironment: ProdEnvironment | null
  
    private constructor(id: string, repository: Url, devEnvironment: DevEnvironment, prodEnvironment: ProdEnvironment | null) {
        this.id = id
        this.repository = repository
        this.devEnvironment = devEnvironment
        this.prodEnvironment = prodEnvironment
    }
  
}
  

