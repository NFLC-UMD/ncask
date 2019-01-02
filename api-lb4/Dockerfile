ARG NODE_VERSION=8

FROM node:${NODE_VERSION} AS dev
LABEL dev=true
RUN groupadd -r nodejs && useradd -m -r -g nodejs -s /bin/bash nodejs
ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /tini
RUN chmod +x /tini
WORKDIR /usr/src/cache
COPY package*.json .
ENV NODE_ENV=development
RUN npm install && chown -R nodejs:nodejs node_modules
RUN npm install -g @loopback/cli
WORKDIR /home/nodejs/app
RUN chown nodejs /home/nodejs/app
COPY --chown=nodejs:nodejs . .
RUN /bin/echo -e "#!/bin/bash\ncp -r /usr/src/cache/node_modules/. /home/nodejs/app/node_modules/ && cd /home/nodejs/app && npm install && npm run ctr:start" > /usr/local/bin/onstartup.sh && chmod 777 /usr/local/bin/onstartup.sh
EXPOSE 3001
USER nodejs
ENTRYPOINT ["/tini", "--"]
CMD ["/usr/local/bin/onstartup.sh"]

FROM node:${NODE_VERSION}-alpine AS build
LABEL build=true
WORKDIR /tmp/build
COPY . .
COPY --from=dev /usr/src/cache .
RUN npm run build:production

FROM node:${NODE_VERSION}-alpine AS deploy
LABEL deploy=true
RUN apk update && apk upgrade && apk add bash && apk add shadow
RUN groupadd -r nodejs && useradd -m -r -g nodejs -s /bin/bash nodejs
RUN apk add --no-cache tini
WORKDIR /home/nodejs/app
RUN chown nodejs /home/nodejs/app && mkdir dist && chown nodejs dist
COPY --chown=nodejs:nodejs package*.json .
COPY --chown=nodejs:nodejs index.js .
ENV NODE_ENV=production
RUN npm install
COPY --chown=nodejs:nodejs --from=build /tmp/build/dist ./dist
USER nodejs
EXPOSE 3001
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]
