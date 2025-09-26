GITCOMMIT := $(shell git rev-parse HEAD)
GITDATE := $(shell git show -s --format='%ct')

LDFLAGSSTRING +=-X main.GitCommit=$(GITCOMMIT)
LDFLAGSSTRING +=-X main.GitDate=$(GITDATE)
LDFLAGS := -ldflags "$(LDFLAGSSTRING)"

build-bk-test-morph-test-qanet-to-morph-doc-qanet:
	source ./makefile-function.sh && MFPnpmInstall && pnpm run build:qanet
	cp -rf nginx_sub_qanet.conf nginx_sub.conf

start-bk-test-morph-test-qanet-to-morph-doc-qanet:
	# mkdir -p logs/morph-doc && pnpm run deploy:qanet
	@echo "starting ngnix..."
	nginx -g 'daemon off;'

	

healthcheck-bk-test-morph-test-qanet-to-morph-doc-qanet:
	curl http://127.0.0.1:8080


build-bk-prod-morph-prod-mainnet-to-morph-doc:
	source ./makefile-function.sh && MFPnpmInstall && pnpm run build:mainnet
	cp -rf nginx_sub_mainnet.conf nginx_sub.conf

start-bk-prod-morph-prod-mainnet-to-morph-doc:
	# mkdir -p logs/morph-doc && pnpm run deploy:mainnet
	@echo "starting ngnix..."
	nginx -g 'daemon off;'

healthcheck-bk-prod-morph-prod-mainnet-to-morph-doc:
	curl http://127.0.0.1:8080

