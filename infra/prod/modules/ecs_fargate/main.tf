resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.env}-cluster"

  tags = {
    Name        = "${var.project_name}-${var.env}-cluster"
    Project     = var.project_name
    Environment = var.env
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-${var.env}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-${var.env}-backend"
      image     = "${var.ecr_repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
      environment = [
        {
          name  = "ConnectionStrings__TodoContext"
          value = var.connection_strings_todo_context_arn
        },
        {
          name  = "Jwt__Secret"
          value = var.jwt_secret_arn
        },
        {
          name  = "Jwt__Issuer"
          value = var.jwt_issuer_arn
        },
        {
          name  = "Jwt__Audience"
          value = var.jwt_audience_arn
        },
        {
          name  = "Cors__AllowedOrigins"
          value = var.cors_allowed_origins_arn
        },
        {
          name  = "Logging__LogLevel__Default"
          value = var.logging_loglevel_default_arn
        },
        {
          name  = "Logging__LogLevel__Microsoft_AspNetCore"
          value = var.logging_loglevel_microsoft_aspnetcore_arn
        }
      ]
    }
  ])

  tags = {
    Project     = var.project_name
    Environment = var.env
  }
}

resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-${var.env}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = var.public_subnet_ids
    security_groups = [aws_security_group.ecs_service.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "${var.project_name}-${var.env}-backend"
    container_port   = 80
  }

  tags = {
    Project     = var.project_name
    Environment = var.env
  }
}

resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.env}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = var.public_subnet_ids
  access_logs {
    bucket = aws_s3_bucket.lb_logs.id
    prefix = "${var.project_name}-${var.env}-lb-logs"
    enabled = true
  }

  tags = {
    Project     = var.project_name
    Environment = var.env
  }
}

resource "aws_s3_bucket" "lb_logs" {
  bucket = "${var.project_name}-${var.env}-lb-logs"

  tags = {
    Project     = var.project_name
    Environment = var.env
  }
}

resource "aws_s3_bucket_policy" "lb_logs" {
  bucket = aws_s3_bucket.lb_logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.lb_logs.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
      }
    ]
  })
}

resource "aws_lb_target_group" "backend" {
  name     = "${var.project_name}-${var.env}-backend-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path = "/health"
  }

  tags = {
    Project     = var.project_name
    Environment = var.env
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}
