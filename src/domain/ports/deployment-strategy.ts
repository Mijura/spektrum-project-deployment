import { Deployment } from "@domain/entities/deployment"
import { Service } from "@domain/entities/service"

export interface DeploymentStrategy {
    deploy(service: Service): Deployment
}