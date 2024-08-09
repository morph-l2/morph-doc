---
title: Upgrade node running on the host
lang: en-US
---

If you are running the Docker container for the node using a custom setup, you will need to update the docker image yourself and then restart the container. 

The source code is available at https://github.com/morph-l2/morph.git. You need to switch to the latest version of the code and then update your docker image.

If you are using  Run a Morph node with docker to start the docker container, you can follow the subsequent steps to upgrade the node.

### Step1:  Fetch latest code version 
```bash
git clone https://github.com/morph-l2/morph.git
## checkout the latest version of the source code you need
git checkout ${latestVersion}
```
### Step2: Stop the nodes and delete previous images

```bash
## stop docker container
cd ops/publicnode
make stop-holesky-node
make rm-holesky-node
## delete the pervious docker image for node
docker rmi morph/node:latest
## delete the pervious docker image for geth
docker rmi morph/geth-nccc:latest
```

### Step3: Build the latest image and restart the container

Please note that we need to ensure that the Docker container startup parameters are consistent with those used previously. If you used a custom configuration before, make sure that the configuration and directory paths used in this run are the same as before. For details, please refer to Advanced Usage

```bash
## start the docker container, it will automatically build the new docker images
make run-holesky-node
```