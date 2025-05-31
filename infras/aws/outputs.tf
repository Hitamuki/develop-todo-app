output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer."
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer for DNS record creation (e.g., in Route 53)."
  value       = aws_lb.main.zone_id
}

output "http_listener_arn" {
  description = "ARN of the HTTP listener for the ALB."
  value       = aws_lb_listener.http.arn
}

output "https_listener_arn" {
  description = "ARN of the HTTPS listener for the ALB (if enabled)."
  value       = var.enable_https ? aws_lb_listener.https[0].arn : "HTTPS listener not enabled. Set enable_https to true and provide acm_certificate_arn."
}

output "frontend_ecr_repository_url" {
  description = "URL of the ECR repository for the frontend application."
  value       = aws_ecr_repository.frontend.repository_url
}

output "backend_ecr_repository_url" {
  description = "URL of the ECR repository for the backend application."
  value       = aws_ecr_repository.backend.repository_url
}

output "rds_instance_endpoint" {
  description = "Endpoint of the RDS MySQL instance."
  value       = aws_db_instance.default.endpoint
  sensitive   = true # The endpoint itself isn't secret, but often used with credentials
}

output "rds_instance_address" {
  description = "Address of the RDS MySQL instance (hostname)."
  value       = aws_db_instance.default.address
  sensitive   = true
}

output "rds_instance_port" {
  description = "Port of the RDS MySQL instance."
  value       = aws_db_instance.default.port
}

output "db_credentials_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the database credentials."
  value       = aws_secretsmanager_secret.db_credentials.arn
  sensitive   = true
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster."
  value       = aws_ecs_cluster.main.name
}

output "ecs_frontend_service_name" {
  description = "Name of the ECS service for the frontend application."
  value       = aws_ecs_service.frontend.name
}

output "ecs_backend_service_name" {
  description = "Name of the ECS service for the backend application."
  value       = aws_ecs_service.backend.name
}

output "ecs_task_execution_role_arn" {
  description = "ARN of the IAM role used by ECS for task execution (pulling images, logging)."
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "ecs_app_task_role_arn" {
  description = "ARN of the IAM role used by the application tasks (for accessing other AWS services)."
  value       = aws_iam_role.ecs_app_task_role.arn
}

output "vpc_id" {
  description = "ID of the created VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "List of IDs of the public subnets."
  value       = [for subnet in aws_subnet.public : subnet.id]
}

output "private_subnet_ids" {
  description = "List of IDs of the private subnets."
  value       = [for subnet in aws_subnet.private : subnet.id]
}

output "alb_security_group_id" {
  description = "ID of the security group attached to the ALB."
  value       = aws_security_group.alb_sg.id
}

output "ecs_service_security_group_id" {
  description = "ID of the security group attached to the ECS services."
  value       = aws_security_group.ecs_service_sg.id
}

output "rds_security_group_id" {
  description = "ID of the security group attached to the RDS instance."
  value       = aws_security_group.rds_sg.id
}

# Output the command to update kubeconfig (if using EKS, not relevant here but good example)
# output "kubeconfig_command" {
#   description = "Command to update kubeconfig for the EKS cluster (example)."
#   value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.main.name}"
# }

output "backend_task_definition_arn" {
  description = "ARN of the backend ECS task definition."
  value       = aws_ecs_task_definition.backend.arn
}

output "frontend_task_definition_arn" {
  description = "ARN of the frontend ECS task definition."
  value       = aws_ecs_task_definition.frontend.arn
}

output "cloudwatch_log_group_frontend" {
  description = "Name of the CloudWatch Log Group for the frontend service."
  value       = "/ecs/${var.project_name}-frontend-task" # Matches what's in main.tf
}

output "cloudwatch_log_group_backend" {
  description = "Name of the CloudWatch Log Group for the backend service."
  value       = "/ecs/${var.project_name}-backend-task" # Matches what's in main.tf
}
