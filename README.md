# Goals

* shared volume mount for dev
* cached node_modules
* support dev / production differences
    * dev: install devDependencies; extra binaries
    * production: alpine linux; npm install --only production
* 

# Resources 

* https://kubernetes.io/docs/concepts/configuration/overview/


DOCKER Reference
———————————

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


KUBERNETES Reference
—————————————

login to docker
then create secret for kubectl

kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>

https://kubernetes.io/docs/reference/kubectl/cheatsheet/


https://forums.docker.com/t/how-to-mount-hostpath-using-docker-for-mac-kubernetes/44083/4


CrashLoopBackOff - need to sleep “3600” to keep alive from config.  Should eventually use command:  to run docker file maybe? start a process kept alive by ??

nginx volume /etc/nginx not mounting on shared vol.  

Things to figure out:
—————————————
- How mount a local share with an active k8 container so you can work with files in IDE on host computer.
    - https://forums.docker.com/t/how-to-mount-hostpath-using-docker-for-mac-kubernetes/44083/4
- How to get shell into running container:
    - https://kubernetes.io/docs/tasks/debug-application-cluster/get-shell-running-container/
    - kubectl exec -it stedlo --container nginx -- /bin/bash
- How to keep container running without relying on sleep “3600”
- How to make conditional configs for dev vs production
    - https://articles.microservices.com/a-development-workflow-for-kubernetes-services-10ee017d752a
- What are the best practices for writing a Dockerfile
    - https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- How to dockerize a nodejs app, i.e. strongloop api
    - https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
    - https://github.com/GoogleCloudPlatform/nodejs-docker
    - https://bitbucket.org/nflcumd/chloe/src/master/
    - https://www.bluepiit.com/blog/containerize-a-node-js-application-using-strongloop-process-manager/
    - https://nodesource.com/blog/containerizing-node-js-applications-with-docker/
    - https://github.com/Yelp/dumb-init
    - https://forums.docker.com/t/how-to-delete-cache/5753/2
    - https://github.com/flyway/flyway-docker
    - https://hub.docker.com/r/openweb/git-sync/


kubectl

Notes:

9/23/18
- realized I don't need any private repos because, with git-sync, all code is pulled onto container after build/run.  No need to build any code into a container image.  Can use plain vanilla node:6, postgres:9.5, nginx, etc.. public images.
- Use stedlo repo purely for k8 pod, service, deployment configs.  
- Will still probably need to build own images for node, postgresql etc.. for customizing directories and mount configs etc... but can keep those images public.
- 'docker stack deploy' allows you to deploy a docker-compose.yml config to a k8 cluster. See: https://docs.docker.com/docker-for-mac/kubernetes/#use-the-kubectl-command
- Will need to use k8 manifests for deployment to a remote k8 cluster.  But can convert docker-compose.yml to k8 manifest files with Kompose cmd later. See: https://kubernetes.io/docs/tasks/configure-pod-container/translate-compose-kubernetes/
- googling best directory structure for k8/docker projects, I found: Helm https://github.com/helm/helm  
- https://www.express-gateway.io was a helm package which may come in handy.

10/14/18
- Installed helm and ran 'helm init' and 'helm create' and reviewed how it works. 
- With helm, got a todolist app running under k8 and exposed to web browser. 
- Re-wrote Dockerfile for node:6 with tini and got it to stay alive. These resources helped:
    - https://www.slideshare.net/cnbailey/ibm-cloud-university-build-deploy-and-scale-nodejs-microservices
    - https://bitbucket.org/atlassian/docker-atlassian-bitbucket-server/src/a888267d2cba061189587ba34068b3e6898974d3/Dockerfile

10/20-21/18
- https://docs.docker.com/develop/dev-best-practices/#use-swarm-services-when-possible
- https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
- https://nodejs.org/en/docs/guides/nodejs-docker-webapp/ - important info here regarding the node_modules directory.  I found that dir was getting overwritten by bind mount for dev env.  that page shows solution.
- https://blog.codeship.com/using-docker-compose-for-nodejs-development/
- https://stackoverflow.com/questions/51097652/install-node-modules-inside-docker-container-and-synchronize-them-with-host

11/5/2018
- https://medium.com/@tonistiigi/advanced-multi-stage-build-patterns-6f741b852fae
- https://www.youtube.com/watch?v=0z3yusiCOCk - Why we need a different container purely for apps - Mark Shuttleworth
- Universal package managers: Snap, Flatpack, Appimage
- https://tutorials.ubuntu.com/tutorial/create-your-first-snap

Next
----------------------
- get chloe api running node:6 container in a way I can edit files and restart easily
    - explore VOLUME mount
    - explore git sidecar 
- Explore persistent storage options in docker and k8; maybe see what kompose does to docker VOLUME?
- get chloe db running in postgres container. must be accessible via Postico; sql query mods must persist across restarts. 
- get flyway migrate running
- separate dev/test/prod yml setups?

