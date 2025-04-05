output "bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  value       = aws_s3_bucket.static_site.bucket_regional_domain_name
}

output "origin_access_identity" {
  description = "CloudFront origin access identity path"
  value       = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
}