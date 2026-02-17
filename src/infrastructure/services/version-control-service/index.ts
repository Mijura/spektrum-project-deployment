import { VersionControlService } from "@app/ports/services/version-control-service"
import { JigJoyVersionControl } from "./jigjoy-vcs"

export const versionControlService: VersionControlService = new JigJoyVersionControl()
