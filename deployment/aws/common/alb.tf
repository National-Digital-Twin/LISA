module "alb" {
  source = "../modules/alb"
  envPrefix = var.envPrefix
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.subnet_ids
  default_cert_arn = module.default_tls_cert.cert_arn
}

output "alb_arn" {
  value = module.alb.alb_arn
}

output "alb_https_listener_arn" {
  value = module.alb.alb_https_listener_arn
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}
