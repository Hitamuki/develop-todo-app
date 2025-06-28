resource "aws_ecr_repository" "backend" {
  name = "${var.project_name}/${var.env}/backend"

  tags = {
    Project     = var.project_name
    Environment = var.env
  }
}
