FROM node:16-bookworm AS certificate-source

FROM node:16-bookworm-slim

# The slim Node 16 image does not include a system CA bundle. Copy it from the
# matching Debian-based image so APT can verify HTTPS repositories normally.
COPY --from=certificate-source /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

ARG TOKEN

RUN sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update -y \
    && apt-get install -y --no-install-recommends zip unzip p7zip-full openssl git python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
RUN git config --global url."https://LimeTray:${TOKEN}@github.com/".insteadOf "https://github.com/"


ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

RUN cd /tmp && npm install

RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

COPY . .

RUN node --max-old-space-size=8192 ./node_modules/.bin/tsc

EXPOSE 8080
CMD [ "node", "./dist/index.js" ]
