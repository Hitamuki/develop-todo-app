# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack ToDo application with:
- **Frontend**: Angular 19 + TypeScript (`src/apps/frontend/`)
- **Backend**: .NET 8 ASP.NET Core Web API (`src/apps/backend/`)
- **Database**: MySQL 8 with Docker

## Development Commands

### Frontend (run in `src/apps/frontend/`)

**Development:**
```bash
yarn install                    # Install dependencies
yarn start                      # Start dev server (http://localhost:4200)
yarn build                      # Build for production
```

**Testing:**
```bash
yarn test                       # Run Jest unit tests
yarn test:watch                 # Run tests in watch mode
yarn test:e2e                   # Run Cypress E2E tests
yarn test:e2e:open              # Open Cypress test runner
```

**Code Quality:**
```bash
yarn lint:fix                   # Auto-fix all linting issues
yarn format                     # Format with Prettier
```

**API Generation:**
```bash
yarn api:generate               # Generate Angular API client from OpenAPI spec
```

### Backend (run in `src/apps/backend/`)

**Development:**
```bash
dotnet restore                  # Restore NuGet packages
dotnet build                    # Build the solution
dotnet run --project src/ToDoApp.Presentation  # Run API (https://localhost:7268)
dotnet test                     # Run all tests
```

**Code Formatting:**
```bash
dotnet format --exclude ./src/OpenApiGenerator ./src/ToDoApp.Infrastructure/EFCoreGenerator
```

### Database

**Start Database:**
```bash
# In src/apps/backend/
docker compose up -d            # Start MySQL container
```

**Connection Details:**
- Host: localhost:3306, Database: todo, User: user, Password: password

## Architecture

### Backend (Layered DDD-inspired)

**Project Dependencies (top to bottom):**
- `ToDoApp.Presentation` - Controllers, HTTP concerns, Program.cs
- `ToDoApp.Application` - Commands/Queries (CQRS), Services, DTOs
- `ToDoApp.Domain` - Entities, Value Objects, Domain Services
- `ToDoApp.Infrastructure` - Repositories, EF Core, External APIs

**Key Patterns:**
- **Schema-First**: OpenAPI Generator creates API contracts from `/docs/openapi.yml`
- **Database-First**: EF Core scaffolding from existing database
- **CQRS**: Command/Query separation in Application layer
- **Repository Pattern**: Data access abstraction in Infrastructure

### Code Generation Workflow

1. **API Changes**: Modify `/docs/openapi.yml`
2. **Backend Generation**: OpenAPI Generator creates controllers/models
3. **Frontend Generation**: Run `yarn api:generate` to create Angular services
4. **Database Changes**: Update SQL files in `/docker/mysql/sql/`

### Important Notes

- **Namespace Conflicts**: Task entity conflicts with `System.Threading.Tasks.Task` - be careful with imports
- **Code Generation**: Exclude auto-generated folders (`OpenApiGenerator`, `EFCoreGenerator`) from formatting
- **HTTPS Development**: Run `dotnet dev-certs https --trust` for local HTTPS
- **URLs**: Backend at https://localhost:7268, Frontend at http://localhost:4200

### Testing

- **Frontend**: Jest for unit tests, Cypress for E2E
- **Backend**: xUnit with Moq and Bogus for test data generation
