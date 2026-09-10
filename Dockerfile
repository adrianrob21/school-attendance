FROM node:20-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-venv python3-pip ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# The node image already provides an unprivileged "node" user.
RUN mkdir -p /home/node/app && chown node:node /home/node/app
USER node
WORKDIR /home/node/app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

# Downloads and checksum-verifies the Raluca model, then builds the SPA.
RUN yarn voice:setup && yarn build

ENV HOST=0.0.0.0 \
    PORT=8080 \
    ORT_DISABLE_TELEMETRY=1

EXPOSE 8080
CMD ["yarn", "serve"]
