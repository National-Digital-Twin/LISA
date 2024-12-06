terraform {
  backend "s3" {
    bucket = "radicalit.terraform-state"
    key    = "lisa/common/terraform.tfstate"
    encrypt = true
    region = "eu-west-2"
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = "eu-west-2"
}

data "aws_region" "current" {}

resource aws_key_pair "ec2-ssh-key" {
  key_name = "lisa-ec2-ssh-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEgNSfZePmreZ9hshbpm+RUmuIiNDsfNsOGwPaJHJCTF dop@dop-home"
}
