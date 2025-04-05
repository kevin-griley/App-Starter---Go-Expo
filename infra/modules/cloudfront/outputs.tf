output "distribution_domain_name" {
  description = "The domain name corresponding to the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "distribution_hosted_zone_id" {
  description = "The hosted zone ID for the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.hosted_zone_id
}