import { DeploymentReport } from "@domain/entities/deployment-report"
import { v4 as uuidv4 } from 'uuid'

export class Environment {

    private constructor(
        readonly id: string,
        private reports: DeploymentReport []
    ) {}

    addReport(report: DeploymentReport){
        this.reports.push(report)
    }

    updateReport(report: DeploymentReport){
        const reportIndex = this.reports.findIndex(r => r.id == report.id)
		if (reportIndex !== -1) {
			throw Error(`Deployment doesn't belong to this environment`)
		}

		this.reports.splice(reportIndex, 1, report)

    }

    static create(): Environment {
        const environmentId = uuidv4()
        return new Environment(environmentId, [])
    }


}