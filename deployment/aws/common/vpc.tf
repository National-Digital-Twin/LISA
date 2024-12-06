module "vpc" {
  source = "../modules/vpc"
  region = data.aws_region.current.name
  envPrefix = "lisa"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "subnet_ids" {
  value = module.vpc.subnet_ids
}

