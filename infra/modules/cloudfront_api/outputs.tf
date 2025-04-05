output "api_distribution_id" {
  description = "The ID of the CloudFront distribution for the API"
  value       = aws_cloudfront_distribution.api_distribution.id
}

output "api_distribution_domain_name" {
  description = "The domain name for the CloudFront distribution"
  value       = aws_cloudfront_distribution.api_distribution.domain_name
}

output "api_distribution_hosted_zone_id" {
  description = "The hosted zone ID for this CloudFront distribution"
  value       = aws_cloudfront_distribution.api_distribution.hosted_zone_id
}

output "api_cf_alias_record_fqdn" {
  description = "Fully qualified domain name of the alias record"
  value       = var.create_dns_record ? aws_route53_record.api_cf_alias[0].fqdn : ""
}