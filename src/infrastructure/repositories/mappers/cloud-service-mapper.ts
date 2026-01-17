import { S3 } from "@domain/service/s3"
import { ServiceType } from "@domain/service/service-type"

export type S3Record =
	| {
			type: ServiceType.S3
			bucketName: string
			bucketWebsiteEndpoint: string
			cloudFrontDomain: string
	  }

export class CloudServiceMapper {
	static toRecord(service: S3): S3Record {
		if (service.type === ServiceType.S3) {
			const s3 = service as S3
			return {
				type: ServiceType.S3,
				bucketName: s3.bucketName,
				bucketWebsiteEndpoint: s3.bucketWebsiteEndpoint,
				cloudFrontDomain: s3.cloudFrontDomain,
			}
		}
		throw new Error("Unsupported service type")
	}

	static toDomain(record: S3Record): S3 {
		if (record.type === ServiceType.S3) {
			return S3.create(record.bucketName, record.bucketWebsiteEndpoint, record.cloudFrontDomain)
		}
		throw new Error("Unsupported service type")
	}
}
