import { WebHostingService } from "@domain/ports/web-hosting-service"
import { FileStorage, FileStorageProvider } from "@jigjoy-io/file-artifacts"
import { S3HostingService } from "@infrastructure/providers/aws/s3-hosting-service"

const fileStorage: FileStorage = FileStorageProvider.create()
// Services
export const hostingService: WebHostingService = new S3HostingService(fileStorage)