import { CloudService, S3, EC2 } from "@domain/value-objects/target-service"

export type CloudServiceRecord = 
	| {
			type: "s3"
			kind: "static-web-app"
			bucketName: string
			prefix: string
			assetBaseUrl: string
			publicAppUrl: string
	  }
	| {
			type: "ec2"
	  }

export class CloudServiceMapper {
	static toRecord(service: CloudService): CloudServiceRecord {
		if (service.type === "s3") {
			const s3 = service as S3
			return {
				type: "s3",
				kind: s3.kind,
				bucketName: s3.bucketName,
				prefix: s3.prefix,
				assetBaseUrl: s3.assetBaseUrl,
				publicAppUrl: s3.publicAppUrl,
			}
		} else {
			return {
				type: "ec2",
			}
		}
	}

	static toDomain(record: CloudServiceRecord): CloudService {
		if (record.type === "s3") {
			const s3 = new S3()
			s3.kind = record.kind
			s3.bucketName = record.bucketName
			s3.prefix = record.prefix
			s3.assetBaseUrl = record.assetBaseUrl
			s3.publicAppUrl = record.publicAppUrl
			return s3
		} else {
			return new EC2()
		}
	}
}

