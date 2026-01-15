locals {
  repos = [
    "${var.project_name}-frontend",
    "${var.project_name}-backend",
    "${var.project_name}-mysql"
  ]
}

resource "aws_ecr_repository" "repos" {
  for_each = toset(local.repos)

  name                 = each.value
  image_tag_mutability = "IMMUTABLE" # מומלץ! כל push חייב תג חדש (v1,v2 וכו')
  force_delete         = true        # נוח בסביבת לימוד (אפשר לשנות ל-false בפרודקשן)

  image_scanning_configuration {
    scan_on_push = true
  }
}

# מוחק אימג'ים ישנים כדי לא לנפח עלויות/לכלוך
resource "aws_ecr_lifecycle_policy" "repos" {
  for_each   = aws_ecr_repository.repos
  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 15 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 15
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

output "ecr_repo_urls" {
  value = { for k, r in aws_ecr_repository.repos : k => r.repository_url }
}
