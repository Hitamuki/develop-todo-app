# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /source

# Copy csproj and restore as distinct layers to leverage Docker cache
COPY ./src/apps/backend/src/ToDoApp.Domain/*.csproj ./ToDoApp.Domain/
COPY ./src/apps/backend/src/ToDoApp.Application/*.csproj ./ToDoApp.Application/
COPY ./src/apps/backend/src/ToDoApp.Infrastructure/*.csproj ./ToDoApp.Infrastructure/
COPY ./src/apps/backend/src/ToDoApp.Presentation/*.csproj ./ToDoApp.Presentation/

# Copy solution file (if it exists and is used for restore)
# Adjust path if your .sln file is elsewhere or not used for restore in this manner
COPY ./src/apps/backend/ToDoApp.sln ./

# For .NET 6+ projects, solution-level restore is common if you have a .sln file.
# If projects are not part of a solution or you prefer project-level restore:
# RUN dotnet restore "./ToDoApp.Presentation/ToDoApp.Presentation.csproj"
# Ensure all project directories are correctly named and paths match your structure.

# It's safer to copy all .csproj files and restore them individually or restore the solution
# Create directories for each project if they are structured like that
RUN mkdir -p ToDoApp.Domain ToDoApp.Application ToDoApp.Infrastructure ToDoApp.Presentation

# Restore all projects by restoring the solution file if it references all of them
# Or restore the main presentation project which should reference others.
# Assuming ToDoApp.Presentation.csproj references other projects correctly.
RUN dotnet restore "./ToDoApp.Presentation/ToDoApp.Presentation.csproj"

# Copy the rest of the source code
COPY ./src/apps/backend/src/ToDoApp.Domain/. ./ToDoApp.Domain/
COPY ./src/apps/backend/src/ToDoApp.Application/. ./ToDoApp.Application/
COPY ./src/apps/backend/src/ToDoApp.Infrastructure/. ./ToDoApp.Infrastructure/
COPY ./src/apps/backend/src/ToDoApp.Presentation/. ./ToDoApp.Presentation/

# Publish the application
RUN dotnet publish "./ToDoApp.Presentation/ToDoApp.Presentation.csproj" -c Release -o /app/publish --no-restore

# Stage 2: Create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose port 8080 (or 80 if your app is configured for it via ASPNETCORE_URLS)
# ASP.NET Core apps default to port 8080 when run in containers.
# If your app is configured to listen on port 80 (e.g., via UseUrls or ASPNETCORE_URLS), change this.
# The ECS task definition will map this to the host port.
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Set the entry point for the application
ENTRYPOINT ["dotnet", "ToDoApp.Presentation.dll"]
