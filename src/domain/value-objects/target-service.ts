export type Service =
  S3

export interface S3 {
    kind: "static-web-app"
    // S3 details
    bucketName: string
    prefix: string   // folder in the bucket, e.g. "apps/project-123/frontend"
    
    // Convenience computed fields:
    assetBaseUrl: string        // e.g. "https://bucket.s3.amazonaws.com/apps/project-123/frontend/"
    publicAppUrl: string        // e.g. "https://project-123.jigjoy.com/"
}