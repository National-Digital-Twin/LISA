variable "region" {
  type = string
}

variable "envPrefix" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "vpc_cidr" {
  type = string
  default = "10.0.0.0/16"
}

variable "webapp_tag" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "webapp_repo_url" {
  type = string
}

variable "scg_repo_url" {
  type = string
}

variable "alb_https_listener_arn" {
  type = string
}

variable "route53_zone_id" {
  type = string
}

variable "alb_dns_name" {
  type = string
}

variable "cognito_user_pool_id" {
  type = string
}

variable "cognito_user_pool_arn" {
  type = string
}

variable "cognito_user_pool_domain" {
  type = string
}
