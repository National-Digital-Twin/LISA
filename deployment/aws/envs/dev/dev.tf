resource "aws_cognito_user_pool" "dev" {
  name = "lisa-dev-cognito-user-pool"
  alias_attributes = [
    "email",
  ]
  mfa_configuration = "OFF"
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  auto_verified_attributes = ["email"]

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }


  username_configuration {
    case_sensitive = false
  }

  /*lifecycle {
      ignore_changes = [
        password_policy,
        schema
      ]
    }
  */
}

resource "aws_cognito_user_pool_domain" "dev" {
  domain       = "radical-lisa-dev"
  user_pool_id = aws_cognito_user_pool.dev.id
}

resource "aws_cognito_user_pool_client" "dev" {
  name = "dev"
  generate_secret = false
  user_pool_id = aws_cognito_user_pool.dev.id
  access_token_validity = 5
  id_token_validity = 5
  prevent_user_existence_errors = "ENABLED"
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = [
    "code"
  ]
  callback_urls = [
    "http://localhost:3000/api/auth/callback",
    "https://c477.radicalit.co.uk/api/auth/callback"
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

resource "aws_s3_bucket" "dev_upload_bucket" {
  bucket = "radical-lisa-dev-uploads"
}

locals {
  dev_users = ["deployment", "dmitry_panov", "paul_graham", "james_grogan", "darren_tarrant", "pete_hunting"]
}

data "aws_iam_policy_document" "dev_cognito_policy" {
  statement {
    actions = [
      "cognito-idp:ListUserPools",
      "cognito-idp:DescribeUserPool",
      "cognito-idp:ListUsers",
      "cognito-idp:AdminGetUser",
      "cognito-idp:AdminListGroupsForUser",
      "cognito-idp:ListUserPoolClients",
      "cognito-idp:DescribeUserPoolClient"
    ]
    resources = [
      aws_cognito_user_pool.dev.arn
    ]
  }
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject"
    ]
    resources = [
      join("", ["arn:aws:s3:::", aws_s3_bucket.dev_upload_bucket.id, "/*"])
    ]
  }
  statement {
    actions = [
      "ssm:GetParameter"
    ]
    resources = [
      "arn:aws:ssm:${data.aws_region.current.name}:${local.account_id}:parameter/lisa/os-maps-key"
    ]
  }
}

resource "aws_iam_policy" "dev_cognito_policy" {
  name        = "CognitoReadOnlyPolicy"
  description = "Read-only access to the Cognito user pool"
  policy      = data.aws_iam_policy_document.dev_cognito_policy.json
}

resource "aws_iam_user_policy_attachment" "dev_webapp_user_policy_attachments" {
  for_each = toset(local.dev_users)
  user       = "dev_${each.value}"
  policy_arn = aws_iam_policy.dev_cognito_policy.arn
}

output "cognito_domain_dev" {
  value = format("%s.auth.%s.amazoncognito.com", aws_cognito_user_pool_domain.dev.domain, data.aws_region.current.name)
}

output "cognito_user_pool_id_dev" {
  value = aws_cognito_user_pool.dev.id
}

output "cognito_user_pool_arn_dev" {
  value = aws_cognito_user_pool.dev.arn
}

output "cognito_user_pool_domain_dev" {
  value = aws_cognito_user_pool_domain.dev.domain
}

output "cognito_client_id_dev" {
  value = aws_cognito_user_pool_client.dev.id
}

output "upload_bucket_id_dev" {
  value = aws_s3_bucket.dev_upload_bucket.id
}
