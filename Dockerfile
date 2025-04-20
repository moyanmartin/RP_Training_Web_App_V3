FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Your csproj is in the root — no subfolder.
COPY ["WebApplication1.csproj", "./"]

RUN dotnet restore "WebApplication1.csproj"

COPY . .

RUN dotnet publish "WebApplication1.csproj" -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app
COPY --from=build /app .

EXPOSE 80

ENTRYPOINT ["dotnet", "WebApplication1.dll"]
