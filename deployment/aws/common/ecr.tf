resource "aws_ecr_repository" "webapp" {
  name                 = "lisa_webapp"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = false

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_ecr_lifecycle_policy" "webapp" {
  repository = aws_ecr_repository.webapp.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last 3 UAT images",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["uat_"],
                "countType": "imageCountMoreThan",
                "countNumber": 3
            },
            "action": {
                "type": "expire"
            }
        },
        {
            "rulePriority": 2,
            "description": "Keep last 3 PROD images",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["prod_"],
                "countType": "imageCountMoreThan",
                "countNumber": 3
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}

resource "aws_ecr_repository" "scg" {
  name                 = "lisa_scg"
  image_tag_mutability = "MUTABLE"
  force_delete         = false

  image_scanning_configuration {
    scan_on_push = false
  }
}


output "webapp_repo_url" {
  value = aws_ecr_repository.webapp.repository_url
}

output "scg_repo_url" {
  value = aws_ecr_repository.scg.repository_url
}
