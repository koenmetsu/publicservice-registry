FROM mcr.microsoft.com/dotnet/core/runtime-deps:2.2.4

LABEL maintainer "agentschap Informatie Vlaanderen <informatie.vlaanderen@vlaanderen.be>"

COPY / /app
WORKDIR /app

EXPOSE 8006/tcp
ENV ASPNETCORE_URLS http://*:8006

ENTRYPOINT ["./PublicServiceRegistry.Projector"]
