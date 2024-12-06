terraform {
  backend "s3" {
    bucket = "radicalit.terraform-state"
    key    = "lisa-uat/terraform.tfstate"
    encrypt = true
    region = "eu-west-2"
    dynamodb_table = "terraform-locks"
  }

  required_providers {
    aws = {
      "source"                = "hashicorp/aws"
      "version"               = ">= 5.0.0"
    }
  }
}

locals {
  envPrefix = "lisa-uat"
}

provider "aws" {
  region = "eu-west-2"
}

data "terraform_remote_state" "common" {
  backend = "s3"
  config = {
    bucket = "radicalit.terraform-state"
    key    = "lisa/common/terraform.tfstate"
    encrypt = true
    region = "eu-west-2"
    dynamodb_table = "terraform-locks"
  }
}

data "terraform_remote_state" "dev" {
  backend = "s3"
  config = {
    bucket = "radicalit.terraform-state"
    key    = "lisa-dev/terraform.tfstate"
    encrypt = true
    region = "eu-west-2"
    dynamodb_table = "terraform-locks"
  }
}

// Use the same user pool as dev
/*
module "cognito" {
  source = "../../modules/cognito"
  envPrefix = local.envPrefix
}
*/

module "app" {
  source = "../../modules/app"
  envPrefix = local.envPrefix
  domain_name = "lisa-uat.radicalit.co.uk"
  region = data.aws_region.current.name
  vpc_id = data.terraform_remote_state.common.outputs.vpc_id
  subnet_ids = data.terraform_remote_state.common.outputs.subnet_ids
  webapp_repo_url = data.terraform_remote_state.common.outputs.webapp_repo_url
  scg_repo_url = data.terraform_remote_state.common.outputs.scg_repo_url
  alb_https_listener_arn = data.terraform_remote_state.common.outputs.alb_https_listener_arn
  alb_dns_name = data.terraform_remote_state.common.outputs.alb_dns_name
  route53_zone_id = data.terraform_remote_state.common.outputs.route53_zone_id
  webapp_tag = var.webapp_tag
  //cognito_user_pool_id = module.cognito.cognito_user_pool_id
  //cognito_user_pool_arn = module.cognito.cognito_user_pool_arn
  //cognito_user_pool_domain = module.cognito.cognito_user_pool_domain
  cognito_user_pool_id = data.terraform_remote_state.dev.outputs.cognito_user_pool_id_dev
  cognito_user_pool_arn = data.terraform_remote_state.dev.outputs.cognito_user_pool_arn_dev
  cognito_user_pool_domain = data.terraform_remote_state.dev.outputs.cognito_user_pool_domain_dev
}

data "aws_region" "current" {}

