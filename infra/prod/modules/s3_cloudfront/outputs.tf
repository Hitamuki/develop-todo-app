output "s3_bucket_website_endpoint" {
  description = "The website endpoint of the S3 bucket"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "s3_bucket_id" {
  description = "The ID of the S3 bucket"
  value       = aws_s3_bucket.frontend.id
}