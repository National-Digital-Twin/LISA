variable "envPrefix" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "default_cert_arn" {
  type = string
}
