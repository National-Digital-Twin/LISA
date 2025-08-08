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
	./schema/upload-predefined-forms.sh ./schema/PredefinedForms/predefined-forms.ttl ./schema/PredefinedForms/predefined-forms-data-schema.json ./schema/PredefinedForms/predefined-forms-ui-schema.json

upload-hazards:
	./schema/upload-predefined-forms.sh ./schema/Hazards/hazards.ttl ./schema/Hazards/hazards-data-schema.json ./schema/Hazards/hazards-ui-schema.json

upload-predefined-forms-and-hazards:
	./schema/upload-predefined-forms.sh ./schema/PredefinedForms/predefined-forms.ttl ./schema/PredefinedForms/predefined-forms-data-schema.json ./schema/PredefinedForms/predefined-forms-ui-schema.json
	./schema/upload-predefined-forms.sh ./schema/Hazards/hazards.ttl ./schema/Hazards/hazards-data-schema.json ./schema/Hazards/hazards-ui-schema.json
