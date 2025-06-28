output "alb_dns_name" {
  description = "The DNS name of the ALB"
  value       = aws_lb.main.dns_name
}

output "ecs_service_security_group_id" {
  value = aws_security_group.ecs_service.id
}