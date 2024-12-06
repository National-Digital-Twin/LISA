module "default_tls_cert" {
  source = "../modules/tls_cert"
  domain_name = "lisa-default.radicalit.co.uk"
  route53_zone_id = var.route53_zone_id
}

output "default_tls_cert_arn" {
  value = module.default_tls_cert.cert_arn
}

output "route53_zone_id" {
  value = var.route53_zone_id
}
