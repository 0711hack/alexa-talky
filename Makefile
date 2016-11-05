default: test

jshint:
	@echo "jshint"
	@./node_modules/.bin/jshint .

circular:
	@echo "circular"
	@./node_modules/.bin/madge --circular --format amd --exclude "madge|source-map" .

mocha:
	@echo "mocha (unit test)"
	@TZ=UTC AWS_REGION=us-east-1 AWS_ACCESS_KEY_ID=akid AWS_SECRET_ACCESS_KEY=secret ./node_modules/.bin/mocha test/*.js
	@echo

coverage:
	@echo "cover"
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha test/*
	@echo

test: jshint
	@echo "test"
	@echo

outdated:
	@echo "outdated modules?"
	@./node_modules/.bin/npmedge
