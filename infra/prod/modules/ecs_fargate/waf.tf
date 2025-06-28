
resource "aws_wafv2_web_acl" "main" {
  name        = "${var.project_name}-${var.env}-web-acl"
  scope       = "REGIONAL"
  default_action {
    allow {}
  }

  rule {
    name     = "AWS-ManagedRules-CommonRuleSet"
    priority = 1
    override_action {
      none {}
    }
    statement {
      managed_rule_group {
        vendor_name = "AWS"
        name        = "AWSManagedRulesCommonRuleSet"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-${var.env}-web-acl"
    sampled_requests_enabled   = true
  }

  tags = {
    Project     = var.project_name
    Environment = var.env
  }
}

resource "aws_wafv2_web_acl_association" "main" {
  resource_arn = aws_lb.main.arn
  web_acl_arn  = aws_wafv2_web_acl.main.arn
}
