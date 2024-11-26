GITCOMMIT := $(shell git rev-parse HEAD)
GITDATE := $(shell git show -s --format='%ct')

LDFLAGSSTRING +=-X main.GitCommit=$(GITCOMMIT)
LDFLAGSSTRING +=-X main.GitDate=$(GITDATE)
LDFLAGS := -ldflags "$(LDFLAGSSTRING)"


build-bk-prod-morph-prod-mainnet-to-morph-doc:
	pnpm i && pnpm run build

start-bk-prod-morph-prod-mainnet-to-morph-doc:
	mkdir -p logs/morph-doc && pnpm run serve

healthcheck-bk-prod-morph-prod-mainnet-to-morph-doc:
	curl http://127.0.0.1:8080

