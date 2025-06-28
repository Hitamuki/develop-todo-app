module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  env          = var.env
}

module "s3_cloudfront" {
  source = "./modules/s3_cloudfront"

  project_name = var.project_name
  env          = var.env
}

module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  env          = var.env
}

module "ecs_fargate" {
  source = "./modules/ecs_fargate"

  project_name           = var.project_name
  env                    = var.env
  ecr_repository_url     = module.ecr.ecr_repository_url
  vpc_id                 = module.vpc.vpc_id
  public_subnet_ids      = module.vpc.public_subnet_ids
  connection_strings_todo_context_arn = module.ssm.connection_strings_todo_context_arn
  jwt_secret_arn         = module.ssm.jwt_secret_arn
  jwt_issuer_arn         = module.ssm.jwt_issuer_arn
  jwt_audience_arn       = module.ssm.jwt_audience_arn
  cors_allowed_origins_arn = module.ssm.cors_allowed_origins_arn
  logging_loglevel_default_arn = module.ssm.logging_loglevel_default_arn
  logging_loglevel_microsoft_aspnetcore_arn = module.ssm.logging_loglevel_microsoft_aspnetcore_arn
}

module "aurora" {
  source = "./modules/aurora"

  project_name       = var.project_name
  env                = var.env
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  ecs_sg_id          = module.ecs_fargate.ecs_service_security_group_id
}

module "route53" {
  source = "./modules/route53"

  zone_id      = var.route53_zone_id
  domain_name  = var.domain_name
  alb_dns_name = module.ecs_fargate.alb_dns_name
  alb_zone_id  = module.ecs_fargate.alb_zone_id
}

module "ssm" {
  source = "./modules/ssm"

  project_name      = var.project_name
  env               = var.env
  aurora_endpoint   = module.aurora.aurora_endpoint
  aurora_port       = module.aurora.aurora_port
  db_username       = var.db_username
  db_password       = var.db_password
  jwt_secret        = var.jwt_secret
  jwt_issuer        = var.jwt_issuer
  jwt_audience      = var.jwt_audience
  cors_allowed_origins       = var.cors_allowed_origins
  logging_loglevel_default = var.logging_loglevel_default
  logging_loglevel_microsoft_aspnetcore = var.logging_loglevel_microsoft_aspnetcore
}
