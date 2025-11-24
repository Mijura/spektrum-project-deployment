
import { StaticWebsiteHosting } from "@application/ports/static-website-hosting"
import { S3WebsiteHosting } from "./service/s3-hosting-service"


// Version Storages
const bucket = process.env.WEB_HOSTING_BUCKET

if (!bucket) 
    throw new Error('Missing WEB_HOSTING_BUCKET env variable')

// Services
export const hostingService: StaticWebsiteHosting = new S3WebsiteHosting(bucket)