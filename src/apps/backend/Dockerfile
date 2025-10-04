# Use the official .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copy csproj and restore as distinct layers
COPY src/apps/backend/*.sln .
COPY src/apps/backend/src/ToDoApp.Application/*.csproj ./src/ToDoApp.Application/
COPY src/apps/backend/src/ToDoApp.Domain/*.csproj ./src/ToDoApp.Domain/
COPY src/apps/backend/src/ToDoApp.Infrastructure/*.csproj ./src/ToDoApp.Infrastructure/
COPY src/apps/backend/src/ToDoApp.Presentation/*.csproj ./src/ToDoApp.Presentation/
COPY src/apps/backend/src/ToDoApp.Shared/*.csproj ./src/ToDoApp.Shared/
# COPY src/apps/backend/tests/ToDoApp.Tests/*.csproj ./tests/ToDoApp.Tests/

# Copy the rest of the source code
COPY src/apps/backend/. .

# Restore dependencies
RUN dotnet restore "TodoApp.sln"

# Build and publish the Presentation layer
WORKDIR "/source/src/ToDoApp.Presentation"
RUN dotnet publish -c Release -o /app/publish

# Use the official ASP.NET Core runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ToDoApp.Presentation.dll"]
