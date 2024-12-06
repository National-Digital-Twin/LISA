terraform {
  backend "s3" {
    bucket = "radicalit.terraform-state"
    key    = "lisa-dev/terraform.tfstate"
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

provider "aws" {
  region = "eu-west-2"
}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}
