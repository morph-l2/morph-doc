# Morphism Documentation Center


Morphism is the first Optimistic zkEVM scaling Solution for Ethereum.

Please note that this repository is undergoing rapid development.

------

This is the source for the [Morphism Documentation](docs.morphism.xyz).

# Usage
## Run locally
```shell
yarn start
```
Then navigate to http://localhost:3000.


## Build for Production
```shell
yarn build
```

### Local Development

```
docker run -it --env-file=.env -e "CONFIG=$(cat ./config.json | jq -r tostring)" algolia/docsearch-scraper

$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
