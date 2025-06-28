variable "project_name" {
  type = string
}

variable "env" {
  type = string
}

variable "ecr_repository_url" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "connection_strings_todo_context_arn" {
  type = string
}

variable "jwt_secret_arn" {
  type = string
}

variable "jwt_issuer_arn" {
  type = string
}

variable "jwt_audience_arn" {
  type = string
}

variable "cors_allowed_origins_arn" {
  type = string
}

variable "allowed_hosts_arn" {
  type = string
}

variable "logging_loglevel_default_arn" {
  type = string
}

variable "logging_loglevel_microsoft_aspnetcore_arn" {
  type = string
}