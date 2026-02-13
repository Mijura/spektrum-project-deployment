# Project Deployment

Project Deployment orchestrates builds, deployments, and environment provisioning for the JigJoy AI coding platform. It manages cloud profiles per project, uploads build artifacts to S3, and tracks deployment targets across environments.

## Architecture

Serverless microservice built with AWS SAM using Clean Architecture (Hexagonal / Ports & Adapters) and Domain-Driven Design.

**AWS Resources:**
- 3 Lambda functions (Node.js 22.x, 128MB, esbuild-bundled)
- 1 DynamoDB table (`${StackName}-ProjectCloudProfile`)
- 1 S3 bucket (`${StackName}-web-hosting`) for deployed frontend artifacts
- IAM roles with `DynamoDBCrudPolicy` + `S3CrudPolicy` per function

**Lambda Functions:**

| Function | Description | Policies |
|----------|-------------|----------|
| CreateCloudProfile | Create a cloud profile for a project | DynamoDBCrudPolicy |
| DeployModule | Deploy a project module (uploads artifacts to S3) | DynamoDBCrudPolicy + S3CrudPolicy |
| GetEntryPoint | Get entry point details for a project/environment | DynamoDBCrudPolicy |

All function ARNs and the bucket name are exported via CloudFormation outputs for use by `platform-serverless-api` and other services.

### S3 Bucket Architecture Decision

The web hosting S3 bucket is defined directly in this service's SAM template rather than managed externally via Secrets Manager. This was chosen because:

- **Project-deployment owns the bucket** - it's the only service that writes deployed artifacts to it
- **No circular dependency** - the bucket name flows via `!Ref` within the same template
- **Infrastructure as code** - the bucket lifecycle is managed by CloudFormation (created/deleted with the stack)
- **Other services access deployments via API** - project-planning and spektrum call project-deployment's Lambda functions through platform-serverless-api (HTTP), they don't access S3 directly

The bucket name is exported as a CloudFormation output (`${StackName}-WebHostingBucketName`).

## Prerequisites

- Node.js 22.x
- AWS SAM CLI
- AWS CLI configured with `spektrum-dev` profile

## Setup

```bash
npm install
```

### GitHub Packages

This project depends on `@jigjoy-ai/file-artifacts`, `@jigjoy-ai/platform-sdk`, and `@jigjoy-ai/serverless-core` from GitHub Packages. You need a `.npmrc` file in the project root:

```
@jigjoy-ai:registry=https://npm.pkg.github.com
```

Your global `~/.npmrc` must have a GitHub PAT with `read:packages` scope:

```
//npm.pkg.github.com/:_authToken=<your-github-pat>
```

### Environment Variables for Tests

Create a `.env.test` file in the project root (gitignored):

```
AWS_REGION="eu-west-1"
PROJECT_CLOUD_PROFILE="spektrum-project-deployment-ProjectCloudProfile"
WEB_HOSTING_BUCKET="spektrum-project-deployment-web-hosting"
```

### Secrets Manager

The following key must exist in the `vars` Secrets Manager secret:

| Key | Description |
|-----|-------------|
| `JigJoyApiEndpoint` | Base URL for the JigJoy platform API (platform-serverless-api) |

## Running Tests

```bash
# Unit tests only (no AWS credentials needed)
npm test

# All tests including DynamoDB + S3 integration tests (requires AWS credentials + deployed stack)
AWS_PROFILE=spektrum-dev npm test

# Coverage report
npm run coverage
```

**Test breakdown:**
- Domain tests: Cloud profile entity, environment, deployment targets
- Application tests: Use cases with in-memory repository/storage mocks
- Infrastructure HTTP tests: Handler request/response validation, error handling
- Infrastructure repository tests: DynamoDB integration (requires deployed stack)
- Infrastructure S3 tests: File upload integration (requires deployed stack)
- Infrastructure service tests: JigJoy API integration (requires valid JigJoyApiEndpoint)

## Build

```bash
npm run build:dev
```

## Deploy

**Stack name:** `spektrum-project-deployment`
**Region:** `eu-west-1`
**Profile:** `spektrum-dev`

```bash
sam deploy --profile spektrum-dev --no-confirm-changeset --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```

Or using npm scripts:

```bash
npm run build:dev
npm run deploy:dev
```

## Local Development

```bash
# Build and serve locally on port 7000
npm run build:local
npm run serve:local

# API docs on port 7070
npm run docs
```

Local development requires an `env.json` file with Lambda environment variables (gitignored).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/cloud-profile/create` | Create a cloud profile for a project |
| POST | `/cloud-profile/deploy-module` | Deploy a project module |
| GET | `/cloud-profile/entry-point/{projectId}` | Get entry point for a project |
