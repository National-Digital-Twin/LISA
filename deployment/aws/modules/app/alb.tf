module "tls_cert" {
  source = "../tls_cert"
  domain_name = var.domain_name
  route53_zone_id = var.route53_zone_id
}

resource "aws_lb_target_group" "ecs_tg" {
  name        = "${var.envPrefix}-ecs-target-group"
  protocol    = "HTTP"
  port        = 3000
  target_type = "instance"
  vpc_id      = var.vpc_id

  health_check {
    enabled             = true
    path                = "/"
    matcher             = 200
    interval            = 10
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  deregistration_delay = 5
}

resource "aws_lb_listener_certificate" "main" {
  listener_arn    = var.alb_https_listener_arn
  certificate_arn = module.tls_cert.cert_arn
  depends_on = [
    module.tls_cert.validation_id
  ]
}

resource "aws_lb_listener_rule" "https" {
  listener_arn  = var.alb_https_listener_arn
  action {
    type = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
  condition {
    host_header {
      values = [var.domain_name]
    }
  }
  lifecycle {
    ignore_changes = [priority]
  }
}

resource "aws_route53_record" "cname" {
  zone_id = var.route53_zone_id
  name    = var.domain_name
  type    = "CNAME"
  ttl     = "60"
  records = [var.alb_dns_name]
}
