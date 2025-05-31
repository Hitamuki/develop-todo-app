# Specify the AWS provider
provider "aws" {
  region = var.aws_region
  # access_key = "TODO: Your AWS Access Key" # Replace with your access key or use IAM roles
  # secret_key = "TODO: Your AWS Secret Key" # Replace with your secret key or use IAM roles
}

# Define variables (actual definitions will be in variables.tf)
variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1" # Or your preferred region
}

variable "project_name" {
  description = "A unique name for the project to prefix resources"
  type        = string
  default     = "my-app"
}

variable "vpc_cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr_blocks" {
  description = "List of CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidr_blocks" {
  description = "List of CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "db_username" {
  description = "MySQL database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "MySQL database password"
  type        = string
  sensitive   = true
}

# --- VPC ---
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# --- Internet Gateway ---
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# --- Subnets ---
# Public Subnets
resource "aws_subnet" "public" {
  count             = length(var.public_subnet_cidr_blocks)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidr_blocks[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index % length(data.aws_availability_zones.available.names)] # Spread across AZs
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet-${count.index + 1}"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidr_blocks)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidr_blocks[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index % length(data.aws_availability_zones.available.names)] # Spread across AZs

  tags = {
    Name = "${var.project_name}-private-subnet-${count.index + 1}"
  }
}

# --- Routing ---
# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# --- Security Groups ---
# Security Group for ALB (allows HTTP/HTTPS from anywhere)
resource "aws_security_group" "alb_sg" {
  name        = "${var.project_name}-alb-sg"
  description = "Allow HTTP/HTTPS inbound traffic to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# Security Group for ECS Services (allows traffic from ALB and for egress)
resource "aws_security_group" "ecs_service_sg" {
  name        = "${var.project_name}-ecs-service-sg"
  description = "Allow traffic from ALB to ECS services"
  vpc_id      = aws_vpc.main.id

  # Ingress from ALB (adjust port for your backend service)
  ingress {
    from_port       = 80 # Assuming backend listens on port 80 internally
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # Allow all outbound traffic for now
  }

  tags = {
    Name = "${var.project_name}-ecs-service-sg"
  }
}

# Security Group for RDS MySQL (allows traffic from ECS services)
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow MySQL traffic from ECS services"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_service_sg.id] # Allow from backend SG
  }

  egress { # Typically not needed for RDS to restrict outbound, but good practice
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}


# --- ECR (Elastic Container Registry) ---
# For Frontend App
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}/frontend"
  image_tag_mutability = "MUTABLE" # Or IMMUTABLE based on your strategy

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-frontend-ecr"
  }
}

# For Backend App
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}/backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-backend-ecr"
  }
}

# --- ECS (Elastic Container Service) ---
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  tags = {
    Name = "${var.project_name}-ecs-cluster"
  }
}

# --- IAM Roles for ECS Tasks ---
data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.project_name}-ecs-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Role for the tasks themselves (permissions your application code needs)
resource "aws_iam_role" "ecs_app_task_role" {
  name               = "${var.project_name}-ecs-app-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

# TODO: Attach policies to ecs_app_task_role for accessing other AWS services if needed by your app
# e.g., S3, SQS, etc.

# --- Secrets Manager ---
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.project_name}/db_credentials"
  description = "Database credentials for the application"
  # kms_key_id = "TODO: Specify KMS key ARN if not using default AWS managed key"
  tags = {
    Name = "${var.project_name}-db-credentials"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials_version" {
  secret_id     = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
    # Add other sensitive data here if needed, e.g., DB_HOST which will be RDS endpoint
  })
}

# Policy to allow ECS tasks to read the specific secret
data "aws_iam_policy_document" "ecs_secrets_policy_doc" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [aws_secretsmanager_secret.db_credentials.arn]
    effect    = "Allow"
  }
}

resource "aws_iam_policy" "ecs_secrets_policy" {
  name        = "${var.project_name}-ecs-secrets-policy"
  description = "Policy to allow ECS tasks to read specific secrets from Secrets Manager"
  policy      = data.aws_iam_policy_document.ecs_secrets_policy_doc.json
}

resource "aws_iam_role_policy_attachment" "ecs_app_task_role_secrets_attachment" {
  role       = aws_iam_role.ecs_app_task_role.name
  policy_arn = aws_iam_policy.ecs_secrets_policy.arn
}


# --- RDS MySQL Instance ---
resource "aws_db_subnet_group" "default" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [for subnet in aws_subnet.private : subnet.id]

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

resource "aws_db_instance" "default" {
  identifier_prefix      = "${var.project_name}-db"
  allocated_storage    = 20 # GB
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0" # Specify your desired MySQL version
  instance_class       = "db.t3.micro" # Choose an appropriate instance class
  # name                 = "mydatabase" # Initial database name (optional, can be created by app)
  username             = jsondecode(aws_secretsmanager_secret_version.db_credentials_version.secret_string)["username"]
  password             = jsondecode(aws_secretsmanager_secret_version.db_credentials_version.secret_string)["password"]
  parameter_group_name = "default.mysql8.0"
  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot  = true # Set to false for production
  # multi_az             = false # Set to true for production for HA
  # availability_zone    = data.aws_availability_zones.available.names[0] # For single AZ, or remove for Multi-AZ

  # Backup and Maintenance
  backup_retention_period = 7 # days
  # backup_window             = "03:00-04:00"
  # maintenance_window        = "sun:04:30-sun:05:30"

  # Deletion protection (enable for production)
  # deletion_protection = true

  tags = {
    Name = "${var.project_name}-mysql-instance"
  }

  # This depends_on is crucial to ensure the secret is created before RDS tries to use its values
  depends_on = [
    aws_secretsmanager_secret_version.db_credentials_version
  ]
}


# --- ALB (Application Load Balancer) ---
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [for subnet in aws_subnet.public : subnet.id]

  enable_deletion_protection = false # Set to true for production

  tags = {
    Name = "${var.project_name}-alb"
  }
}

# Target group for Frontend (assuming it's a static site served by a simple web server like Nginx in a container)
resource "aws_lb_target_group" "frontend" {
  name        = "${var.project_name}-frontend-tg"
  port        = 80 # Port the frontend container listens on
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip" # For Fargate

  health_check {
    path                = "/" # Health check path for frontend
    protocol            = "HTTP"
    matcher             = "200-299"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "${var.project_name}-frontend-tg"
  }
}

# Target group for Backend
resource "aws_lb_target_group" "backend" {
  name        = "${var.project_name}-backend-tg"
  port        = 8080 # Changed from 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip" # For Fargate

  health_check {
    path                = "/health" # TODO: Update with your backend's health check endpoint
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "${var.project_name}-backend-tg"
  }
}

# ALB Listener for HTTP (redirect to HTTPS in production)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "forward" # In production, this should redirect to HTTPS
    target_group_arn = aws_lb_target_group.frontend.arn # Default to frontend
  }
  # For production, you'd have something like:
  # default_action {
  #   type = "redirect"
  #   redirect {
  #     port        = "443"
  #     protocol    = "HTTPS"
  #     status_code = "HTTP_301"
  #   }
  # }
}

# TODO: Add HTTPS listener once a certificate is available
# resource "aws_lb_listener" "https" {
#   load_balancer_arn = aws_lb.main.arn
#   port              = 443
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-2016-08" # Choose an appropriate policy
#   certificate_arn   = "TODO: ARN of your ACM certificate"
#
#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.frontend.arn
#   }
# }

# Listener Rule for Backend API traffic (e.g., /api/*)
resource "aws_lb_listener_rule" "backend_api" {
  listener_arn = aws_lb_listener.http.arn # Change to HTTPS listener ARN in production
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"] # Paths for your backend API
    }
  }
}

# --- ECS Service Definitions (Fargate) ---

# Frontend Service
resource "aws_ecs_service" "frontend" {
  name            = "${var.project_name}-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn # Reference task definition
  desired_count   = 1 # Number of tasks to run
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [for subnet in aws_subnet.public : subnet.id] # Frontend can be in public for direct ALB access if serving static content
    security_groups = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = true # Required for Fargate tasks in public subnets to pull images if no NAT Gateway
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "${var.project_name}-frontend-container" # Must match container name in task definition
    container_port   = 80 # Port exposed by the frontend container
  }

  # Ensure ALB is created before the service tries to attach to its target group
  depends_on = [aws_lb_listener.http, aws_iam_role.ecs_app_task_role]
}

# Backend Service
resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn # Reference task definition
  desired_count   = 1 # Number of tasks to run
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [for subnet in aws_subnet.private : subnet.id] # Backend in private subnets
    security_groups = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = false # Not needed for private subnets if NAT Gateway is used for outbound
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "${var.project_name}-backend-container" # Must match container name in task definition
    container_port   = 80 # Port exposed by the backend container (Kestrel default)
  }

  # Ensure ALB and IAM role are created before the service
  depends_on = [aws_lb_listener.http, aws_iam_role.ecs_app_task_role, aws_secretsmanager_secret.db_credentials]
}


# --- ECS Task Definitions ---

# Frontend Task Definition
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project_name}-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256" # Example: 0.25 vCPU
  memory                   = "512" # Example: 0.5 GB RAM
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_app_task_role.arn # For app-specific permissions

  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-frontend-container"
      image     = "${aws_ecr_repository.frontend.repository_url}:latest" # Will be built and pushed via CI/CD
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 80 # Port the frontend container (e.g., Nginx) listens on
          hostPort      = 80 # Not used in awsvpc mode but required
          protocol      = "tcp"
        }
      ],
      environment = [
        {
          name  = "API_URL",
          value = "${var.enable_https ? "https" : "http"}://${aws_lb.main.dns_name}/api"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-frontend-task"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "${var.project_name}-frontend-task-def"
  }
}

# Backend Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"  # Example: 0.5 vCPU
  memory                   = "1024" # Example: 1 GB RAM
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_app_task_role.arn # Role for application permissions

  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-backend-container"
      image     = "${aws_ecr_repository.backend.repository_url}:latest" # Will be built and pushed via CI/CD
      cpu       = 512
      memory    = 1024
      essential = true
      portMappings = [
        {
          containerPort = 8080 # Changed from 80
          hostPort      = 8080 # Changed from 80
          protocol      = "tcp"
        }
      ],
      environment = [ # Non-sensitive environment variables
        { name = "ASPNETCORE_ENVIRONMENT", value = "Production" }, # Or var.aspnetcore_environment
        { name = "ASPNETCORE_URLS", value = "http://+:8080" },    # Matches exposed port
        { name = "DB_NAME", value = "todoappdb" },                # Added DB_NAME
        { name = "DB_HOST", value = aws_db_instance.default.address } # Added DB_HOST directly
      ],
      secrets = [ # Injecting DB credentials from Secrets Manager
        {
          name      = "DB_USER", # Environment variable name in container
          valueFrom = "${aws_secretsmanager_secret.db_credentials.arn}:username::" # Gets 'username' key from secret
        },
        {
          name      = "DB_PASSWORD",
          valueFrom = "${aws_secretsmanager_secret.db_credentials.arn}:password::"
        }
        # Add other secrets your backend needs, e.g., API keys
        # { name = "API_KEY", valueFrom = "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:myapikey-SECRET_NAME" }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-backend-task"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "${var.project_name}-backend-task-def"
  }
   depends_on = [aws_db_instance.default] # Ensure DB is available for endpoint address
}

# --- CloudWatch Log Groups (Optional - ECS creates them by default if logConfiguration is set) ---
# resource "aws_cloudwatch_log_group" "frontend_lg" {
#   name              = "/ecs/${var.project_name}-frontend-task"
#   retention_in_days = 7 # Adjust as needed
#   tags = {
#     Name = "${var.project_name}-frontend-logs"
#   }
# }

# resource "aws_cloudwatch_log_group" "backend_lg" {
#   name              = "/ecs/${var.project_name}-backend-task"
#   retention_in_days = 7
#   tags = {
#     Name = "${var.project_name}-backend-logs"
#   }
# }


# --- Data sources ---
data "aws_availability_zones" "available" {}

# --- Outputs (actual definitions will be in outputs.tf) ---
# output "alb_dns_name" {
#   description = "DNS name of the Application Load Balancer"
#   value       = aws_lb.main.dns_name
# }

# output "frontend_ecr_repository_url" {
#   description = "URL of the ECR repository for the frontend"
#   value       = aws_ecr_repository.frontend.repository_url
# }

# output "backend_ecr_repository_url" {
#   description = "URL of the ECR repository for the backend"
#   value       = aws_ecr_repository.backend.repository_url
# }

# output "rds_instance_endpoint" {
#   description = "Endpoint of the RDS MySQL instance"
#   value       = aws_db_instance.default.endpoint
# }

# output "db_credentials_secret_arn" {
#   description = "ARN of the Secrets Manager secret for DB credentials"
#   value       = aws_secretsmanager_secret.db_credentials.arn
# }

# --- TODOs and Placeholders ---
# TODO: Replace placeholder values (e.g., access_key, secret_key) if not using IAM roles.
# TODO: Configure actual domain name and HTTPS certificate for ALB.
# TODO: Review and adjust instance sizes, counts, and capacities for production.
# TODO: Implement proper NAT Gateway for private subnets if outbound internet access is needed and assign_public_ip is false for Fargate tasks.
# TODO: Update backend health check path in aws_lb_target_group.backend.
# TODO: Define more specific IAM policies for ecs_app_task_role based on application needs.
# TODO: Ensure frontend application is built to connect to the backend via the ALB DNS name (e.g. /api/*).
# TODO: Ensure backend application reads DB host, user, password from environment variables injected by ECS.
# TODO: KMS key for Secrets Manager for enhanced security.
# TODO: Set skip_final_snapshot = false and deletion_protection = true for RDS in production.
# TODO: Set enable_deletion_protection = true for ALB in production.
# TODO: Configure CI/CD pipelines to build Docker images and push them to ECR, then update ECS services.
