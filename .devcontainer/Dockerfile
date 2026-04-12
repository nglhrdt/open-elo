FROM mcr.microsoft.com/devcontainers/javascript-node:4-24-trixie

ENV VERSION=7.1.0
RUN curl --location --remote-name https://github.com/Orange-OpenSource/hurl/releases/download/${VERSION}/hurl_${VERSION}_amd64.deb \
    && apt-get update \
    && apt-get install -y ./hurl_${VERSION}_amd64.deb \
    && rm hurl_${VERSION}_amd64.deb
