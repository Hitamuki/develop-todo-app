variable "region" {
  description = "AWS region"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "env" {
  description = "Environment"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53 Hosted Zone ID"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "jwt_secret" {
  description = "JWT Secret for the application"
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "cors_allowed_origins" {
  description = "CORS Allowed Origins for the application"
  type        = string
}

variable "jwt_issuer" {
  description = "JWT Issuer for the application"
  type        = string
}

variable "jwt_audience" {
  description = "JWT Audience for the application"
  type        = string
}

variable "allowed_hosts" {
  description = "Allowed Hosts for the application"
  type        = string
  default     = "*"
}

variable "logging_loglevel_default" {
  description = "Logging LogLevel Default for the application"
  type        = string
}

variable "logging_loglevel_microsoft_aspnetcore" {
  description = "Logging LogLevel Microsoft.AspNetCore for the application"
  type        = string
}