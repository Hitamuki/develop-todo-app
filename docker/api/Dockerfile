# ベースイメージとして .NET 8.0 SDK を使用
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# プロジェクトファイルをコピーして復元
COPY ./src/apps/backend/src/TodoApp.Presentation/TodoApp.Presentation.csproj ./src/apps/backend/src/TodoApp.Presentation/
RUN dotnet restore ./src/apps/backend/src/TodoApp.Presentation/TodoApp.Presentation.csproj

# 残りのソースコードをコピーしてビルド
COPY ./src/apps/backend/src ./src/apps/backend/src
RUN dotnet publish ./src/apps/backend/src/TodoApp.Presentation -c Release -o out

# 実行環境として ASP.NET Core ランタイムイメージを使用
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "TodoApp.Presentation.dll"]
