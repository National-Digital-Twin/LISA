resource "aws_cognito_user_pool_client" "main" {
  name = "dev"
  generate_secret = true
  user_pool_id = var.cognito_user_pool_id
  access_token_validity = 5
  id_token_validity = 5
  prevent_user_existence_errors = "ENABLED"
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = [
    "code"
  ]
  callback_urls = [
    "https://${var.domain_name}/api/auth/callback"
  ]
  allowed_oauth_scopes = [
    "phone",
    "email",
    "openid",
    "profile"
  ]
  supported_identity_providers = [
    "COGNITO"
  ]
}
