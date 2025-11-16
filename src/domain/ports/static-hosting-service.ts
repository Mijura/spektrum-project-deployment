import { Project } from "@domain/entities/project"
import { Url } from "@domain/value-objects/url"

export interface StaticHostingService {
    deploy(project: Project): Promise<Url>
}