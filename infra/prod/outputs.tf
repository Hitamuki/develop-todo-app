output "s3_bucket_website_endpoint" {
  description = "The website endpoint of the S3 bucket"
  value       = module.s3_cloudfront.s3_bucket_website_endpoint
}

output "alb_dns_name" {
  description = "The DNS name of the ALB"
  value       = module.ecs_fargate.alb_dns_name
}

output "db_instance_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = module.aurora.db_instance_endpoint
}

output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = module.ecr.ecr_repository_url
}
