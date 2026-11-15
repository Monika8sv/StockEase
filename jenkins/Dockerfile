FROM jenkins/jenkins:lts-jdk21

USER root

# Install required tools
RUN apt-get update && apt-get install -y \
    maven \
    nodejs \
    npm \
    docker.io \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER jenkins