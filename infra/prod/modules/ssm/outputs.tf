output "connection_strings_todo_context_arn" {
  value = aws_ssm_parameter.connection_strings_todo_context.arn
}

output "jwt_secret_arn" {
  value = aws_ssm_parameter.jwt_secret.arn
}

output "jwt_issuer_arn" {
  value = aws_ssm_parameter.jwt_issuer.arn
}

output "jwt_audience_arn" {
  value = aws_ssm_parameter.jwt_audience.arn
}

output "cors_allowed_origins_arn" {
  value = aws_ssm_parameter.cors_allowed_origins.arn
}

output "logging_loglevel_default_arn" {
  value = aws_ssm_parameter.logging_loglevel_default.arn
}

output "logging_loglevel_microsoft_aspnetcore_arn" {
  value = aws_ssm_parameter.logging_loglevel_microsoft_aspnetcore.arn
}