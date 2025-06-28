variable "project_name" {
  type = string
}

variable "env" {
  type = string
}

variable "aurora_endpoint" {
  type = string
}

variable "aurora_port" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
  sensitive = true
}

variable "jwt_secret" {
  type = string
  sensitive = true
}

variable "jwt_issuer" {
  type = string
}

variable "jwt_audience" {
  type = string
}

variable "cors_allowed_origins" {
  type = string
}

variable "allowed_hosts" {
  type = string
}

variable "logging_loglevel_default" {
  type = string
}

variable "logging_loglevel_microsoft_aspnetcore" {
  type = string
}