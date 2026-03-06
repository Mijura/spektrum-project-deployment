import { S3Client } from "@app/ports/services/s3-client"
import { JigJoyS3Client } from "./jigjoy-s3-client"

export const s3Client: S3Client = new JigJoyS3Client()
