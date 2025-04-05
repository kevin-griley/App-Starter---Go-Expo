terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

########################################
# 1) ACM Certificate for Your Domain
########################################
# Note: ACM Certificates for CloudFront must be in us-east-1
resource "aws_acm_certificate" "this" {
  domain_name               = var.domain_name
  validation_method         = "DNS"
  subject_alternative_names = [
    "www.${var.domain_name}"
  ]

  # Ensures Terraform won't destroy the cert before the new one is provisioned
  lifecycle {
    create_before_destroy = true
  }
}

# Create validation records in Route53
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

# Validate the certificate using the DNS records
resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [
    for record in aws_route53_record.cert_records : record.fqdn
  ]
}

########################################
# 2) S3 Bucket for Static Site
########################################
resource "aws_s3_bucket" "static_site" {
  bucket        = var.domain_name
  force_destroy = true  # set to true if you want to allow cleaning up easily
}

# This Origin Access Identity (OAI) lets CloudFront read from the private bucket
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "CloudFront OAI for ${var.domain_name}"
}

# S3 Bucket Policy allowing only CloudFront to read from this bucket
data "aws_iam_policy_document" "allow_cloudfront" {
  statement {
    sid     = "AllowCloudFrontRead"
    effect  = "Allow"

    principals {
      type        = "CanonicalUser"
      identifiers = [aws_cloudfront_origin_access_identity.oai.s3_canonical_user_id]
    }
    
    actions = ["s3:GetObject"]
    
    resources = [
      "${aws_s3_bucket.static_site.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_policy" "static_site_policy" {
  bucket = aws_s3_bucket.static_site.id
  policy = data.aws_iam_policy_document.allow_cloudfront.json
}

########################################
# 3) CloudFront Distribution
########################################
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  aliases             = [var.domain_name, "www.${var.domain_name}"]
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.static_site.bucket_regional_domain_name
    origin_id   = "s3-${var.domain_name}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = "s3-${var.domain_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Custom Error Response: Map a 403 error to /index.html and return a 200
  custom_error_response {
    error_code            = 403               // When a 403 is encountered
    response_page_path    = "/index.html"     // CloudFront will serve this page
    response_code         = 200               // Response will be sent as a 200 OK
    error_caching_min_ttl = 300               // Cache error response for 300 seconds (adjust as needed)
  }

  # Choose the certificate validated above
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.this.certificate_arn
    ssl_support_method        = "sni-only"
    minimum_protocol_version  = "TLSv1.2_2019"
  }

  # Adjust price class for cost/performance (PriceClass_All, PriceClass_200, PriceClass_100)
  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  # Optional logging config for debugging (comment in if needed)
  # logging_config {
  #   include_cookies = true
  #   bucket          = "my-logs-bucket.s3.amazonaws.com"
  #   prefix          = "cloudfront-logs/"
  # }
}

########################################
# 4) Route53 DNS Records
########################################

# A record for bare domain
resource "aws_route53_record" "root_alias" {
  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

# A record for www subdomain
resource "aws_route53_record" "www_alias" {
  zone_id = var.hosted_zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}
