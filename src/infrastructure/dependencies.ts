
import { StaticWebsiteHosting } from "@app/ports/outbound/static-website-hosting"
import { S3WebsiteHosting } from "@infra/website-hosting/s3-website-hosting"


// Version Storages
const bucket = process.env.WEB_HOSTING_BUCKET

if (!bucket) 
    throw new Error('Missing WEB_HOSTING_BUCKET env variable')

// Services
export const hostingService: StaticWebsiteHosting = new S3WebsiteHosting(bucket)