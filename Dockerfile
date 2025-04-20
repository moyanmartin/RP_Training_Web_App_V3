# Use official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory to /src
WORKDIR /src

# Copy the csproj and restore any dependencies (via npm, if you have frontend)
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]

# Restore dependencies
RUN dotnet restore "WebApplication1/WebApplication1.csproj"

# Copy the rest of the code
COPY . .

# Build the project
RUN dotnet publish "WebApplication1/WebApplication1.csproj" -c Release -o /app

# Use official .NET runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

WORKDIR /app

# Set entry point for the container
ENTRYPOINT ["dotnet", "WebApplication1.dll"]

# Expose the app port
EXPOSE 80

# Copy the build output to the container
COPY --from=build /app .
