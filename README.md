# AI Meeting → Execution Web

Frontend repository for the AI Meeting → Execution product. It will provide the user experience for authentication, workspaces, meetings, review, tasks, settings, and integrations. It is intended to deploy independently from the API.

## Status

Bootstrap only. No UI screens, application behavior, or backend integration have been implemented.

## Repository boundaries

- The web client consumes the backend public API through `NEXT_PUBLIC_API_URL`.
- Do not hardcode API URLs or connect directly to the backend database.
- The backend API base path is planned as `/api/v1`; the backend owns the API contract and OpenAPI documentation.
- Set `NEXT_PUBLIC_API_URL` to the desired backend base URL, for example `http://localhost:3001/api/v1` for local development. Production builds should receive the deployed API URL through environment configuration.

## Local setup and commands

There is no runnable application or dependency manifest in this bootstrap. Development commands, environment variables, tests, and deployment instructions will be added after requirements and implementation are approved.

Copy `.env.example` to `.env.local` when a later phase adds the application. Never commit local environment files or credentials.

## Development workflow

Follow the canonical constitution and approved specifications in the sibling `meeting-execution-specs` repository. The backend owns the API contract; the web client consumes it through `NEXT_PUBLIC_API_URL`. Open `AI-Meeting-Execution.code-workspace` to work with all three independent repositories. Resolve specification conflicts explicitly before changing architecture or behavior.
