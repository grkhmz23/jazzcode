FROM node:20.18.1-bookworm-slim

ARG RUST_TOOLCHAIN=1.82.0
ARG SOLANA_VERSION=v2.1.11
ARG ANCHOR_VERSION=0.30.1

ENV DEBIAN_FRONTEND=noninteractive
ENV CARGO_HOME=/opt/cargo
ENV RUSTUP_HOME=/opt/rustup
ENV PATH=/opt/cargo/bin:/home/runner/.local/share/solana/install/active_release/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    unzip \
    tar \
    jq \
    build-essential \
    pkg-config \
    libssl-dev \
  && rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain ${RUST_TOOLCHAIN} \
  && rustup component add rustfmt clippy

RUN useradd -m -u 10001 runner \
  && mkdir -p /home/runner/.local/share/solana \
  && chown -R runner:runner /home/runner /opt/cargo /opt/rustup

USER runner
WORKDIR /home/runner

RUN sh -c "$(curl -sSfL https://release.anza.xyz/${SOLANA_VERSION}/install)" \
  && solana --version

RUN cargo install --locked anchor-cli --version ${ANCHOR_VERSION} \
  && anchor --version

WORKDIR /srv/runner
COPY --chown=runner:runner package.json ./
RUN npm install --omit=dev
COPY --chown=runner:runner src ./src
COPY --chown=runner:runner tests ./tests

ENV RUNNER_PORT=8787
EXPOSE 8787

CMD ["npm", "run", "start"]
