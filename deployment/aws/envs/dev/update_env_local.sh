#!/bin/sh

FILE="../../../../backend/.env-local"

replace() {
  sed -i "s#^\($1=\).*#\1\"$2\"#" $FILE
}

DOMAIN=$(terraform output -raw cognito_domain_dev)
POOL=$(terraform output -raw cognito_user_pool_id_dev)
CLIENT=$(terraform output -raw cognito_client_id_dev)

replace COGNITO_DOMAIN "$DOMAIN"
replace COGNITO_USER_POOL_ID "$POOL"
replace COGNITO_CLIENT_ID "$CLIENT"
