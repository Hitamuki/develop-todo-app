variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]$", var.aws_region))
    error_message = "Must be a valid AWS region name (e.g., us-east-1, ap-northeast-1)."
  }
}

variable "project_name" {
  description = "A unique name for the project to prefix resources. Should be lowercase, and can contain hyphens."
  type        = string
  default     = "my-app"
  validation {
    condition     = can(regex("^[a-z0-9]+[a-z0-9-]*[a-z0-9]+$", var.project_name)) && length(var.project_name) >= 3 && length(var.project_name) <= 30
    error_message = "Project name must be 3-30 characters, lowercase alphanumeric, and can contain hyphens but not at start/end."
  }
}

variable "vpc_cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
  validation {
    condition     = can(cidrnet(var.vpc_cidr_block, 0)) # Basic check if it's a valid CIDR
    error_message = "Must be a valid IPv4 CIDR block (e.g., 10.0.0.0/16)."
  }
}

variable "public_subnet_cidr_blocks" {
  description = "List of CIDR blocks for public subnets. Must provide at least two for different AZs."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
  validation {
    condition     = length(var.public_subnet_cidr_blocks) >= 2 && alltrue([for k, v in var.public_subnet_cidr_blocks : can(cidrnet(v, 0))])
    error_message = "Must provide at least two valid IPv4 CIDR blocks for public subnets."
  }
}

variable "private_subnet_cidr_blocks" {
  description = "List of CIDR blocks for private subnets. Must provide at least two for different AZs."
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
  validation {
    condition     = length(var.private_subnet_cidr_blocks) >= 2 && alltrue([for k, v in var.private_subnet_cidr_blocks : can(cidrnet(v, 0))])
    error_message = "Must provide at least two valid IPv4 CIDR blocks for private subnets."
  }
}

variable "db_username" {
  description = "MySQL database admin username. Min 4, max 16 chars, alphanumeric."
  type        = string
  sensitive   = true
  validation {
    condition     = length(var.db_username) >= 4 && length(var.db_username) <= 16 && can(regex("^[a-zA-Z0-9_]+$", var.db_username))
    error_message = "Database username must be 4-16 alphanumeric characters."
  }
  # No default, should be explicitly set, e.g. via a .tfvars file or environment variable
  # default = "TODO:" # This is a placeholder, user must provide this
}

variable "db_password" {
  description = "MySQL database admin password. Min 8, max 41 chars, printable ASCII except /, \", @, '."
  type        = string
  sensitive   = true
  validation {
    condition     = length(var.db_password) >= 8 && length(var.db_password) <= 41 && can(regex("^[\\x21-\\x2B\\x2D-\\x3F\\x41-\\x7E]+$", var.db_password))
    error_message = "Database password must be 8-41 printable ASCII characters, excluding /, \", @, '."
  }
  # No default, should be explicitly set
  # default = "TODO:" # This is a placeholder, user must provide this
}

# Placeholder for AWS Account ID - needed for some ARN constructions if not using data sources or if region/account partitioning is specific.
# variable "aws_account_id" {
#   description = "AWS Account ID. Required for specific ARN constructions if not inferred."
#   type        = string
#   default     = "TODO:YOUR_AWS_ACCOUNT_ID" # User must replace this
#   validation {
#     condition     = can(regex("^[0-9]{12}$", var.aws_account_id)) || var.aws_account_id == "TODO:YOUR_AWS_ACCOUNT_ID"
#     error_message = "Must be a 12-digit AWS Account ID or the placeholder 'TODO:YOUR_AWS_ACCOUNT_ID'."
#   }
# }

# Placeholder for ACM certificate ARN for HTTPS listener
variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS on the ALB. Required if enabling HTTPS."
  type        = string
  default     = "TODO:YOUR_ACM_CERTIFICATE_ARN" # User must replace this if using HTTPS
  # Add validation if you want to enforce ARN structure, e.g.
  # validation {
  #   condition     = can(regex("^arn:aws:acm:[a-z0-9-]+:[0-9]{12}:certificate/.+$", var.acm_certificate_arn)) || var.acm_certificate_arn == "TODO:YOUR_ACM_CERTIFICATE_ARN"
  #   error_message = "Must be a valid ACM certificate ARN or the placeholder 'TODO:YOUR_ACM_CERTIFICATE_ARN'."
  # }
}

# Placeholder for KMS Key ID/ARN for encrypting Secrets Manager secrets
variable "secrets_manager_kms_key_id" {
  description = "KMS Key ID or ARN for encrypting Secrets Manager secrets. If not set, uses AWS managed key."
  type        = string
  default     = "TODO:YOUR_KMS_KEY_ID_OR_ARN" # User can leave as TODO to use default AWS managed key, or provide their own
}

# Docker image URIs - these will typically be outputs from a CI/CD pipeline
# However, defining them as variables allows manual override or setting if not using CI/CD for image names.
variable "frontend_image_uri" {
  description = "Full URI of the frontend Docker image in ECR (e.g., <account_id>.dkr.ecr.<region>.amazonaws.com/<project_name>/frontend:latest)"
  type        = string
  default     = "TODO:FRONTEND_IMAGE_URI" # This will be dynamically set by ECR resource usually, but can be overridden
}

variable "backend_image_uri" {
  description = "Full URI of the backend Docker image in ECR (e.g., <account_id>.dkr.ecr.<region>.amazonaws.com/<project_name>/backend:latest)"
  type        = string
  default     = "TODO:BACKEND_IMAGE_URI" # This will be dynamically set by ECR resource usually, but can be overridden
}

# ECS Task CPU/Memory configurations
variable "frontend_task_cpu" {
  description = "CPU units for the frontend ECS task (e.g., 256 for 0.25 vCPU)"
  type        = string # Terraform Fargate CPU is string type
  default     = "256"
}

variable "frontend_task_memory" {
  description = "Memory in MiB for the frontend ECS task (e.g., 512 for 0.5GB)"
  type        = string # Terraform Fargate Memory is string type
  default     = "512"
}

variable "backend_task_cpu" {
  description = "CPU units for the backend ECS task (e.g., 512 for 0.5 vCPU)"
  type        = string
  default     = "512"
}

variable "backend_task_memory" {
  description = "Memory in MiB for the backend ECS task (e.g., 1024 for 1GB)"
  type        = string
  default     = "1024"
}

variable "backend_container_port" {
  description = "The port the backend container listens on."
  type        = number
  default     = 80
}

variable "frontend_container_port" {
  description = "The port the frontend container listens on."
  type        = number
  default     = 80
}

variable "backend_health_check_path" {
  description = "Path for the backend health check."
  type        = string
  default     = "/healthz" # Example, adjust to your backend's actual health check
}

variable "db_instance_class" {
  description = "RDS instance class (e.g., db.t3.micro, db.m5.large)."
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB."
  type        = number
  default     = 20
}

variable "db_engine_version_mysql" {
  description = "MySQL engine version for RDS."
  type        = string
  default     = "8.0.35" # Specify a recent, available version
}

variable "rds_skip_final_snapshot" {
  description = "Determines whether a final DB snapshot is created before the DB instance is deleted."
  type        = bool
  default     = true # Set to false for production
}

variable "rds_deletion_protection" {
  description = "If the DB instance should have deletion protection enabled."
  type        = bool
  default     = false # Set to true for production
}

variable "alb_enable_deletion_protection" {
  description = "If the ALB should have deletion protection enabled."
  type        = bool
  default     = false # Set to true for production
}

variable "ecs_desired_count_frontend" {
  description = "Desired number of tasks for the frontend service."
  type        = number
  default     = 1
}

variable "ecs_desired_count_backend" {
  description = "Desired number of tasks for the backend service."
  type        = number
  default     = 1
}

variable "enable_https" {
  description = "Set to true to enable HTTPS listener on ALB. Requires acm_certificate_arn to be set."
  type        = bool
  default     = false
}

# This variable is used to update the secret string of DB credentials
# It's not directly used by RDS resource for username/password, but by the secretsmanager_secret_version resource
# The RDS resource then reads from this secret.
# This is a map that will be converted to JSON for the secret string.
variable "db_credentials_secret_map" {
  description = "Map containing database credentials (username, password) to be stored in Secrets Manager. The RDS instance will use these values."
  type        = map(string)
  sensitive   = true
  default = {
    username = "TODO_DB_USERNAME" # This will be overridden by var.db_username in main.tf's secret resource
    password = "TODO_DB_PASSWORD" # This will be overridden by var.db_password in main.tf's secret resource
    # Add other fields like 'host', 'port', 'dbname' if you want to store the full connection string parts in the secret
  }
  # Note: In main.tf, the aws_secretsmanager_secret_version resource directly uses
  # var.db_username and var.db_password for its jsonencode() input.
  # This variable definition is more for completeness if one were to pass the whole map.
  # For the current main.tf, direct use of db_username and db_password in the secret resource is fine.
}
