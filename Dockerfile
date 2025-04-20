# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY WebApplication1/*.csproj ./WebApplication1/
RUN dotnet restore ./WebApplication1/WebApplication1.csproj

# Copy everything else and build
COPY . .
WORKDIR /app/WebApplication1
RUN dotnet publish -c Release -o /app/out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "WebApplication1.dll"]
