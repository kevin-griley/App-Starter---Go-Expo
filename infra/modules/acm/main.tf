# (Optional) If you want to enforce us-east-1 for certificates:
# provider "aws" {
#   alias  = "us_east_1"
#   region = "us-east-1"
# }
# Then refer to provider = aws.us_east_1 in resources below if needed.

resource "aws_acm_certificate" "this" {
  # provider = aws.us_east_1  # Uncomment if you created an aliased provider
  domain_name               = var.domain_name
  validation_method         = "DNS"
  subject_alternative_names = var.subject_alternative_names

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_records" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = var.hosted_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "this" {
  # provider = aws.us_east_1
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [
    for record in aws_route53_record.cert_records : record.fqdn
  ]
}