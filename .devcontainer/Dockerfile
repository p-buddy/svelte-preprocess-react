# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.187.0/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 16, 18, 20
ARG VARIANT="20-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

RUN su node -c "npm install -g pnpm@9"

