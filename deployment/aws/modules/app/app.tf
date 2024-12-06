resource "aws_s3_bucket" "upload_bucket" {
  bucket = "radical-${var.envPrefix}-uploads"
}

data "aws_iam_policy_document" "ecs_task_doc" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "webapp_policy" {
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
      var.cognito_user_pool_arn
    ]
  }
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject"
    ]
    resources = [
      join("", ["arn:aws:s3:::", aws_s3_bucket.upload_bucket.id, "/*"])
    ]
  }
  statement {
    actions = [
      "ssm:GetParameter"
    ]
    resources = [
      "arn:aws:ssm:${var.region}:${local.account_id}:parameter/lisa/os-maps-key"
    ]
  }
}

resource "aws_iam_policy" "webapp_policy" {
  name        = "${var.envPrefix}-WebappPolicy"
  policy      = data.aws_iam_policy_document.webapp_policy.json
}

resource "aws_iam_role" "ecs_webapp_task_role" {
  name               = "${var.envPrefix}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_doc.json
}

resource "aws_iam_role" "ecs_exec_role" {
  name               = "${var.envPrefix}-ecs-exec-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_doc.json
}

resource "aws_iam_role_policy_attachment" "ecs_exec_role_policy" {
  role       = aws_iam_role.ecs_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_role_policy" {
  role       = aws_iam_role.ecs_webapp_task_role.name
  policy_arn = aws_iam_policy.webapp_policy.arn
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.envPrefix}"
  retention_in_days = 14
}

resource "aws_ecs_task_definition" "webapp" {
  family             = "${var.envPrefix}-webapp-ecs-task"
  network_mode       = "bridge"
  requires_compatibilities = ["EC2"]
  task_role_arn      = aws_iam_role.ecs_webapp_task_role.arn
  execution_role_arn = aws_iam_role.ecs_exec_role.arn
  cpu                = 512
  memory             = 128
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = nonsensitive(jsonencode([
    {
      name      = "webapp"
      image     = "${var.webapp_repo_url}:${var.webapp_tag}"
      environment = [
        {
          name = "AWS_REGION"
          value = var.region
        },
        {
          name = "SERVER_URL"
          value = "https://${var.domain_name}"
        },
        {
          name = "SCG_URL"
          value = "http://scg1:3030"
        },
        {
          name = "S3_BUCKET_ID"
          value = aws_s3_bucket.upload_bucket.id
        },
        {
          name = "MAX_UPLOAD_SIZE"
          value = "104857600"
        },
        {
          name = "COGNITO_DOMAIN"
          value = format("%s.auth.%s.amazoncognito.com", var.cognito_user_pool_domain, var.region)
        },
        {
          name = "COGNITO_USER_POOL_ID"
          value = var.cognito_user_pool_id
        },
        {
          name = "COGNITO_CLIENT_ID"
          value = aws_cognito_user_pool_client.main.id
        },
        {
          name = "COGNITO_CLIENT_SECRET"
          value = aws_cognito_user_pool_client.main.client_secret
        },
        {
          name = "NODE_ENV"
          value = "production"
        }
      ]
      cpu       = 512
      memory    = 128
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 0
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-region"        = var.region,
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name,
          "awslogs-stream-prefix" = "app"
        }
      }
      healthCheck = {
        interval = 30
        retries = 3
        timeout = 5
        command = [ "CMD-SHELL", "wget -q -O /dev/null http://localhost:3000" ]
      }
    }
  ]))

  track_latest = true

  /*lifecycle {
    ignore_changes = [
      container_definitions
    ]
  }*/
}

resource "aws_ecs_task_definition" "scg" {
  family             = "${var.envPrefix}-scg-ecs-task"
  network_mode       = "bridge"
  requires_compatibilities = ["EC2"]
  execution_role_arn = aws_iam_role.ecs_exec_role.arn
  cpu                = 1024
  memory             = 512
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  volume {
    name = "scg-data"

    efs_volume_configuration {
      file_system_id = aws_efs_file_system.scg-data.id

      root_directory = "/"

      transit_encryption = "ENABLED"

      authorization_config {
        access_point_id = aws_efs_access_point.scg-data.id
      }
    }
  }

  container_definitions = jsonencode([
    {
      name      = "scg"
      image     = "${var.scg_repo_url}:0.80.0"
      command = [
        "--ping",
        "--config",
        "/fuseki/config/config.ttl"
      ]
      environment = [
        {
          name = "JAVA_OPTIONS"
          value = "-XX:MaxRAMPercentage=70.0"
        },
        {
          name = "JWKS_URL"
          value = "disabled"
        }
      ]
      cpu       = 1024
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3030
          hostPort      = 0
          protocol      = "tcp"
          name = "scg-port"
        }
      ]
      mountPoints = [
        {
          containerPath = "/fuseki/data"
          sourceVolume  = "scg-data"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-region"        = var.region,
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name,
          "awslogs-stream-prefix" = "scg"
        }
      }
      healthCheck = {
        interval = 30
        retries = 3
        timeout = 5
        command = [ "CMD-SHELL", "pidof java" ]
      }
    }
  ])
}

resource "aws_ecs_service" "webapp" {
  name            = "${var.envPrefix}-webapp"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.webapp.arn
  desired_count   = 1

  deployment_controller {
    type = "ECS"
  }

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_tg.arn
    container_name = "webapp"
    container_port = 3000
  }

  service_connect_configuration {
    enabled = true
    namespace = aws_service_discovery_http_namespace.cloudmap-namespace.arn
  }

  capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.main.name
    base              = 1
    weight            = 100
  }

  /*ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }*/

  depends_on = [
    aws_iam_role_policy_attachment.ecs_node_role_policy
  ]

  lifecycle {
    ignore_changes = [desired_count]
  }

}

resource "aws_efs_file_system" "scg-data" {
  creation_token = "${var.envPrefix}-scg-data"
}

resource "aws_efs_mount_target" "scg-data" {
  for_each           = toset(var.subnet_ids)
  file_system_id     = aws_efs_file_system.scg-data.id
  subnet_id          = each.value
  security_groups = [aws_security_group.efs_sg.id]
}

resource "aws_efs_access_point" "scg-data" {
  file_system_id = aws_efs_file_system.scg-data.id

  posix_user {
    gid = 1000
    uid = 1000
  }

  root_directory {
    path = "/data"
    creation_info {
      owner_gid   = 1000
      owner_uid   = 1000
      permissions = "755"
    }
  }
}

resource "aws_security_group" "efs_sg" {
  name        = "${var.envPrefix}-efs-security-group"
  description = "Security group for EFS mount target"

  vpc_id = var.vpc_id

  ingress {
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    security_groups = [aws_security_group.ecs_node_sg.id]
  }
}

resource "aws_ecs_service" "scg" {
  name            = "${var.envPrefix}-scg1"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.scg.arn
  desired_count   = 1

  deployment_controller {
    type = "ECS"
  }

  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent         = 100

  capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.main.name
    base              = 1
    weight            = 100
  }

  ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }

  service_connect_configuration {
    enabled = true
    namespace = aws_service_discovery_http_namespace.cloudmap-namespace.arn
    service {
      client_alias {
        dns_name = "scg1"
        port = "3030"
      }
      discovery_name = "scg1"
      port_name = "scg-port"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.ecs_node_role_policy
  ]
}

resource "aws_service_discovery_http_namespace" "cloudmap-namespace" {
  name        = "${var.envPrefix}-namespace"
  description = "Namespace for Service Discovery"
}

