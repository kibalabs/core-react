install:
	@ npm ci

install-updates:
	@ npm install

list-outdated: install
	@ npm outdated

lint-check:
	@ npx lint

lint-check-ci:
	@ npx lint --output-file lint-check-results.json --output-file-format annotations

lint-fix:
	@ npx lint --fix

type-check:
	@ npx type-check

type-check-ci:
	@ npx type-check --output-file type-check-results.json --output-file-format annotations

security-check:
	@ # NOTE(krishan711): maybe use npm audit
	@ echo "Not Supported"

security-check-ci:
	@ echo "Not Supported"

build:
	@ NODE_ENV=production npx build-module-rolldown

build-ssr:
	@ echo "Not Supported"

build-static:
	@ echo "Not Supported"

start:
	@ NODE_ENV=development npx build-module-rolldown --start

start-prod:
	@ NODE_ENV=production npx build-module-rolldown --start

test:
	@ echo "Not Supported"

publish:
	@ npm publish

publish-next:
ifneq ($(COMMIT_COUNT),0)
	npx kiba-publish --next --next-version $(COMMIT_COUNT)
endif

clean:
	@ rm -rf ./node_modules ./package-lock.json ./build ./dist

.PHONY: *
