FROM node:8 AS dev
RUN groupadd -r nodejs && useradd -m -r -g nodejs -s /bin/bash nodejs
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENV NODE_ENV=development
RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache
COPY package*.json .
RUN npm install
RUN chown -R nodejs:nodejs node_modules
RUN npm install -g @loopback/cli
WORKDIR /home/nodejs/app
COPY --chown=nodejs:nodejs . .
RUN /bin/echo -e "#!/bin/bash\ncp -r /usr/src/cache/node_modules/. /home/nodejs/app/node_modules/ && cd /home/nodejs/app && npm start" > /usr/local/bin/onstartup.sh && chmod 777 /usr/local/bin/onstartup.sh
EXPOSE 3001
USER nodejs
ENTRYPOINT ["/tini", "--"]
CMD ["/usr/local/bin/onstartup.sh"]

# run production builds on Alpine linux
# FROM node:8-alpine AS production
# # addgroup doesn't exist in alpine linux
# RUN addgroup nodejs && useradd -m -r -g nodejs -s /bin/bash nodejs
# ENV TINI_VERSION v0.18.0
# RUN apk add --no-cache tini
# ENV NODE_ENV=production
# WORKDIR /home/nodejs/app
# COPY --chown=nodejs:nodejs . .
# RUN npm install --only=production
# RUN chown -R nodejs:nodejs node_modules
# USER nodejs
# EXPOSE 3001
# ENTRYPOINT ["/sbin/tini", "--"]
# CMD ["npm", "start"]
