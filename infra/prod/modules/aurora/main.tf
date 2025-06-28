data "aws_ssm_parameter" "db_password" {
  name = "/${var.project_name}/${var.env}/db_password"
}

resource "aws_rds_cluster" "main" {
  cluster_identifier      = "${var.project_name}-${var.env}-aurora-cluster"
  engine                  = "aurora-mysql"
  engine_version          = "5.7.mysql_aurora.2.07.1"
  database_name           = "${var.project_name}${var.env}"
  master_username         = "admin"
  master_password         = data.aws_ssm_parameter.db_password.value
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [aws_security_group.aurora.id]
}

resource "aws_rds_cluster_instance" "main" {
  count              = 1
  identifier         = "${var.project_name}-${var.env}-aurora-instance-${count.index}"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = "db.t3.micro"
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.env}-aurora-sng"
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "aurora" {
  name        = "${var.project_name}-${var.env}-aurora-sg"
  description = "for Aurora"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [var.ecs_sg_id]
  }
}
