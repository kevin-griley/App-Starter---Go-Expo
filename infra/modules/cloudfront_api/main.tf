resource "aws_cloudfront_distribution" "api_distribution" {
  enabled = true
  # Use the subdomain as alias so that “api.fleetexpand.com” -> CloudFront
  aliases = ["${var.api_subdomain}.${var.domain_name}"]

  # Customize if you need a default root object
  default_root_object = var.default_root_object
  price_class         = var.price_class

  origin {
    domain_name = var.origin_domain_name
    origin_id   = "api-origin"

    custom_origin_config {
      # Adjust these to match your API’s behavior
      origin_protocol_policy = "http-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.1", "TLSv1"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "api-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = var.allowed_methods
    cached_methods  = var.cached_methods

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }
  }

  # Example: no custom error pages. Adjust if your API needs it.
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = var.ssl_support_method
    minimum_protocol_version = var.minimum_protocol_version
  }

  # Optional logging, comment out if not needed
  # logging_config {
  #   bucket = "my-cloudfront-logs.s3.amazonaws.com"
  #   prefix = "api-logs/"
  # }
}

resource "aws_route53_record" "api_cf_alias" {
  count = var.create_dns_record ? 1 : 0

  zone_id = var.hosted_zone_id
  name    = "${var.api_subdomain}.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.api_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.api_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}