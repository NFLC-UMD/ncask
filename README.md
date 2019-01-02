# Requirements
* Docker
* Docker compose

# Quickstart

```sh
git clone https://github.com/NFLC-UMD/ncask.git
cd ncask
docker-compose up
```


# User Stories
This starter kit addresses the following user stories.  
As a developer, I want ...

1. to use a gateway to proxy the legacy api, so that I can transition at a reasonable pace to a  microservices infrastructure.
2. to be able to make code edits with an IDE in my local environment and have those changes instantly synced to the container, so that a re-compile/start will be fairly quick.
3. the node_modules cached on the container's image, so that creating a new container from the dev image is not overly time consuming.
4. to be able to install additional modules within container cli, exit container and re-build to have the new modules added to image cache of node_modules.
5. cli dev tools on the dev image so that any dev working with the image has the same toolset and stack to work with.
6. to be able to run the Loopback 4 cli "lb4" scaffolding commands within container, exit container, and not loose newly generated code. IOW: the file sync with host, must be 2-way.
7. production images under 200MB so that we can separate components of the legacy stack into docker images without the total size becoming unwieldy.
8. to use a lightweight process supervisor and init system designed to run as PID 1, so that if the process exits, the container exits. 
9. to be able to restart nodejs without exiting the container during development, so that my workflow is fast.


# Helper scripts
See the helper scripts: build, run, start, stop and clean.  To utilize these, make them executable:

```sh
sudo chmod +x build
sudo chmod +x run
sudo chmod +x stop
sudo chmod +x clean
```

# Loopback 4 API Dockerfile Unpacked

```docker
ARG NODE_VERSION=8

# All three stages are named and labeled so they may be targeted and found elsewhere (e.g. see ./build)
FROM node:${NODE_VERSION} AS dev
LABEL dev=true

# Good practice to not run our app under the root account
RUN groupadd -r nodejs && useradd -m -r -g nodejs -s /bin/bash nodejs

# Use single process init supervisor
ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /tini
RUN chmod +x /tini

# Cache node_modules
WORKDIR /usr/src/cache
COPY package*.json .
ENV NODE_ENV=development
RUN npm install && chown -R nodejs:nodejs node_modules

# Loopback's "lb4" command for scaffolding app components
RUN npm install -g @loopback/cli

# Here is where we put our app code
WORKDIR /home/nodejs/app
RUN chown nodejs /home/nodejs/app
COPY --chown=nodejs:nodejs . .

# Create the entrypoint script; note: volume sync happens before startup and excludes the node_modules directory (see: .dockerignore); So, on Startup we want to:
#   - copy cached node_modules to app directory
RUN /bin/echo -e "#!/bin/bash\ncp -r /usr/src/cache/node_modules/. /home/nodejs/app/node_modules/ && cd /home/nodejs/app && npm install && npm run ctr:start" > /usr/local/bin/onstartup.sh && chmod 777 /usr/local/bin/onstartup.sh
EXPOSE 3001
USER nodejs
ENTRYPOINT ["/tini", "--"]
CMD ["/usr/local/bin/onstartup.sh"]

# The build stage is removed immediately afterwards (see: ./build) 
FROM node:${NODE_VERSION}-alpine AS build
LABEL build=true
WORKDIR /tmp/build
COPY . .

# We copy node_modules from the dev cache because we need our build tools to run the production build.
COPY --from=dev /usr/src/cache .

# Compare tsconfig.json and tsconfig.production.json for build differences
RUN npm run build:production

# Deployments on Alpine Linux to keep image under 200MB; But Alpine doesn't have the same default tools so we'll need to install some extras; but don't need Tini since that one is pre-installed.
FROM node:${NODE_VERSION}-alpine AS deploy
LABEL deploy=true 
RUN apk update && apk upgrade && apk add bash && apk add shadow
RUN groupadd -r nodejs && useradd -m -r -g nodejs -s /bin/bash nodejs
RUN apk add --no-cache tini
WORKDIR /home/nodejs/app
RUN chown nodejs /home/nodejs/app && mkdir dist && chown nodejs dist
COPY --chown=nodejs:nodejs package*.json .
COPY --chown=nodejs:nodejs index.js .

# In the "deploy" stage we'll install only production modules
ENV NODE_ENV=production
RUN npm install

# Then copy over the compiled typescript from the build server
COPY --chown=nodejs:nodejs --from=build /tmp/build/dist ./dist
USER nodejs
EXPOSE 3001
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]

```

# Docker references
Remove all containers: 
```shell
docker rm $(docker ps -a -q)
```

When developing your Dockerfile use --no-cache because you'll be running this again and again.  But you can also start interactive terminal as shown on line 2 and install more stuff.  Then incorporate those commands into RUN statements in your Dockerfile and re-build.
```shell
docker build -t <image-name> --no-cache .
docker run -p 3001:3001/tcp —-name <container-name> -it <image-name> bash
```

To see stopped container and get the given name or random mnemonic assigned
```shell
docker ps -a 
```

Not recommended, but you can also save changes back to the :latest tag of your image, if you don't incorporate them in the Dockerfile.
```shell
docker commit <container-name> <image-name>
```

Get IP address of running container?
```shell
docker inspect <container id> | grep "IPAddress"
```


Notes:

- https://kubernetes.io/docs/tasks/configure-pod-container/translate-compose-kubernetes/
- Helm https://github.com/helm/helm  
- https://www.express-gateway.io was a helm package which may come in handy.

- https://www.slideshare.net/cnbailey/ibm-cloud-university-build-deploy-and-scale-nodejs-microservices
- https://bitbucket.org/atlassian/docker-atlassian-bitbucket-server/src/a888267d2cba061189587ba34068b3e6898974d3/Dockerfile

- https://docs.docker.com/develop/dev-best-practices/#use-swarm-services-when-possible
- https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
- https://nodejs.org/en/docs/guides/nodejs-docker-webapp/ - important info here regarding the node_modules directory.  I found that dir was getting overwritten by bind mount for dev env.  that page shows solution.
- https://blog.codeship.com/using-docker-compose-for-nodejs-development/
- https://stackoverflow.com/questions/51097652/install-node-modules-inside-docker-container-and-synchronize-them-with-host

- https://medium.com/@tonistiigi/advanced-multi-stage-build-patterns-6f741b852fae
- https://www.youtube.com/watch?v=0z3yusiCOCk - Why we need a different container purely for apps - Mark Shuttleworth
- Universal package managers: Snap, Flatpack, Appimage
- https://tutorials.ubuntu.com/tutorial/create-your-first-snap
- https://stackoverflow.com/questions/38787396/docker-restart-entrypoint


# Credits & References

* https://stackoverflow.com/questions/51097652/install-node-modules-inside-docker-container-and-synchronize-them-with-host
* https://nodesource.com/blog/containerizing-node-js-applications-with-docker/
* https://docs.docker.com/develop/develop-images/multistage-build/
* https://stackoverflow.com/questions/35414479/docker-ports-are-not-exposed - cannot use host: 'localhost' or '127.0.0.1' for server listening host in container. must use '0.0.0.0' or omit for default value.
* https://caylent.com/50-useful-kubernetes-tools/
* https://kubeapps.com/
* 