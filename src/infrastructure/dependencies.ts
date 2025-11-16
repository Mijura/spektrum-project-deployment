
import { FileStorage, FileStorageProvider } from "@jigjoy-io/file-storage"
import { JigJoyS3HostingService } from "./service/s3-hosting-service"
import { StaticHostingService } from "@domain/ports/static-hosting-service"

const fileStorage: FileStorage = FileStorageProvider.create()
// Services
export const hostingService: StaticHostingService = new JigJoyS3HostingService(fileStorage)