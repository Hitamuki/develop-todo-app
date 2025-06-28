output "aurora_endpoint" {
  description = "The endpoint of the Aurora cluster"
  value       = aws_rds_cluster.main.endpoint
}

output "aurora_port" {
  description = "The port of the Aurora cluster"
  value       = aws_rds_cluster.main.port
}