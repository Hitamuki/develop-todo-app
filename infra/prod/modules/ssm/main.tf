resource "aws_ssm_parameter" "connection_strings_todo_context" {
  name        = "/${var.project_name}/${var.env}/ConnectionStrings__TodoContext"
  description = "Database connection string for TodoContext"
  type        = "SecureString"
  value       = "Server=${var.aurora_endpoint};Port=${var.aurora_port};Database=${var.project_name}${var.env};User=${var.db_username};Password=${var.db_password};"
}

resource "aws_ssm_parameter" "jwt_secret" {
  name        = "/${var.project_name}/${var.env}/Jwt__Secret"
  description = "JWT Secret for the application"
  type        = "SecureString"
  value       = var.jwt_secret
}

resource "aws_ssm_parameter" "jwt_issuer" {
  name        = "/${var.project_name}/${var.env}/Jwt__Issuer"
  description = "JWT Issuer for the application"
  type        = "String"
  value       = var.jwt_issuer
}

resource "aws_ssm_parameter" "jwt_audience" {
  name        = "/${var.project_name}/${var.env}/Jwt__Audience"
  description = "JWT Audience for the application"
  type        = "String"
  value       = var.jwt_audience
}

resource "aws_ssm_parameter" "cors_allowed_origins" {
  name        = "/${var.project_name}/${var.env}/Cors__AllowedOrigins"
  description = "CORS Allowed Origins for the application"
  type        = "String"
  value       = var.cors_allowed_origins
}

resource "aws_ssm_parameter" "logging_loglevel_default" {
  name        = "/${var.project_name}/${var.env}/Logging__LogLevel__Default"
  description = "Logging LogLevel Default for the application"
  type        = "String"
  value       = var.logging_loglevel_default
}

resource "aws_ssm_parameter" "logging_loglevel_microsoft_aspnetcore" {
  name        = "/${var.project_name}/${var.env}/Logging__LogLevel__Microsoft_AspNetCore"
  description = "Logging LogLevel Microsoft.AspNetCore for the application"
  type        = "String"
  value       = var.logging_loglevel_microsoft_aspnetcore
}