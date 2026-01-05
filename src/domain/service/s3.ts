import { CloudService } from "./cloud-service"
import { ServiceType } from "./service-type"

export class S3 extends CloudService {
	type: ServiceType.S3
	bucketName: string
	bucketWebsiteEndpoint: string
    cloudFrontDomain: string

	private constructor(bucketName: string, bucketWebsiteEndpoint: string, cloudFrontDomain: string) {
        super()
		this.bucketName = bucketName
		this.bucketWebsiteEndpoint = bucketWebsiteEndpoint
		this.cloudFrontDomain = cloudFrontDomain
	}

	static create(bucketName: string, bucketWebsiteEndpoint: string, cloudFrontDomain: string): S3 {
		return new S3(bucketName, bucketWebsiteEndpoint, cloudFrontDomain)
	}
}