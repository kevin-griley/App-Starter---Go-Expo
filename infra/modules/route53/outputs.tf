output "root_record_fqdn" {
  description = "Fully qualified domain name for the root alias record"
  value       = aws_route53_record.root_alias.fqdn
}

output "www_record_fqdn" {
  description = "Fully qualified domain name for the www alias record"
  value       = aws_route53_record.www_alias.fqdn
}