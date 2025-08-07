# Load environment variables from .env file
ifneq (,$(wildcard .env))
    include .env
    export $(shell sed 's/=.*//' .env)
endif

sonarqube-up:
	docker run -d -p 9000:9000 -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true --name sonarqube sonarqube:25.1.0.102122-community


run-sonar-scan:
	docker run \
		--rm \
		--network="host" \
		-v ${PWD}:/usr/src \
		-e SONAR_HOST_URL="http://localhost:9000" \
		-e SONAR_SCANNER_OPTS="-Dsonar.projectKey=${SONAR_PROJECT_KEY}" \
		-e SONAR_TOKEN="${SONAR_TOKEN}" \
		sonarsource/sonar-scanner-cli

lisa-sag-up:
	docker compose -f ./deployment/sag/docker-compose.yaml up -d

lisa-sag-down:
	docker compose -f ./deployment/sag/docker-compose.yaml down

upload-predefined-forms:
	./schema/upload-predefined-forms.sh ./schema/predefined-forms.ttl ./schema/predefined-forms-data-schema.json ./schema/predefined-forms-ui-schema.json
