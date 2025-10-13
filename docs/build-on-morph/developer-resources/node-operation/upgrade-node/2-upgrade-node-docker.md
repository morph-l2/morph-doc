---
title: Upgrade node running from docker
lang: en-US
---

## Docker Images

- `go-ethereum:` [ghcr.io/morph-l2/go-ethereum](https://github.com/morph-l2/go-ethereum/pkgs/container/go-ethereum)

- `node:` [ghcr.io/morph-l2/node](https://github.com/morph-l2/morph/pkgs/container/node)

### If You Are Using a Custom Setup
If you are running the Docker container for the node using a custom setup, you will need to manually update the Docker image version and restart the container.

### If You Are Using the Recommended Configuration
For those using the [Run a full node with docker](../full-node/1-run-in-docker.md) to start the container, follow these steps to upgrade your node.

#### Step 1:  Update docker images version 

- Check the latest docker image version from [Docker Images](#docker-images)
- Update the docker image version on [morph-node/docker-compose.yml](https://github.com/morph-l2/run-morph-node/blob/run_node_script/morph-node/docker-compose.yml)
    
    ```yaml title="morph-node/docker-compose.yml"
    services:  
    geth: 
        container_name: morph-geth
        image: ghcr.io/morph-l2/go-ethereum:{update_version} ## Specify the Geth image version
        restart: unless-stopped
    
    # ...

    node:
        container_name: morph-node
        depends_on:
        geth:
            condition: service_started
        image: ghcr.io/morph-l2/node:{update_version} ## Specify the Node image version
    
    # ...

    ```

    :::tip
    Optionally update the image version for go-ethereum, node, or both, depending on your requirements.
    :::

#### Step 2: Restart the container

Use the following commands to stop and restart the container. The updated Docker images will be pulled automatically.

```js
// stop the docker containers
make stop-node

// start the docker container, it will automatically pull the updated docker images
make run-node
```

If you are running a **validator**, use these commands instead: 
```bash
make stop-validator
make run-validator
```

:::note 
Ensure that the startup parameters for the Docker container remain consistent with your previous configuration. If you previously used a custom setup, verify that the configuration and directory paths match your earlier setup. For details, please refer to [**Advanced Usage**](../full-node/1-run-in-docker.md#advanced-usage) 
:::

