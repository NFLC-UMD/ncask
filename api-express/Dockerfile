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
WORKDIR /home/nodejs/app
COPY --chown=nodejs:nodejs . .
RUN /bin/echo -e "#!/bin/bash\ncp -r /usr/src/cache/node_modules/. /home/nodejs/app/node_modules/ && cd /home/nodejs/app && npm start" > /usr/local/bin/onstartup.sh && chmod 777 /usr/local/bin/onstartup.sh
EXPOSE 3000
USER nodejs
ENTRYPOINT ["/tini", "--"]
CMD ["/usr/local/bin/onstartup.sh"]
