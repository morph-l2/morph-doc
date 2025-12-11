GITCOMMIT := $(shell git rev-parse HEAD)
GITDATE := $(shell git show -s --format='%ct')

LDFLAGSSTRING +=-X main.GitCommit=$(GITCOMMIT)
LDFLAGSSTRING +=-X main.GitDate=$(GITDATE)
LDFLAGS := -ldflags "$(LDFLAGSSTRING)"

define SETUP_LOG_SDK
	@echo "Installing web-sdk@1.1.33..."
	pnpm install web-sdk@1.1.33
	@echo "Injecting log code..."
	node src/inject-log-code.js
endef

build-bk-prod-morph-prod-mainnet-to-morph-doc:
	pnpm i
	$(SETUP_LOG_SDK)
	pnpm run build

start-bk-prod-morph-prod-mainnet-to-morph-doc:
	mkdir -p logs/morph-doc && pnpm run serve

healthcheck-bk-prod-morph-prod-mainnet-to-morph-doc:
	curl http://127.0.0.1:8080

