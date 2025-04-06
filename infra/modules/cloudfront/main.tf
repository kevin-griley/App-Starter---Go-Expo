resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  aliases             = var.aliases
  default_root_object = var.default_root_object
  price_class         = var.price_class

  origin {
    domain_name = var.bucket_regional_domain_name
    origin_id   = "s3-${var.domain_name}"

    s3_origin_config {
      origin_access_identity = var.origin_access_identity
    }
  }

  default_cache_behavior {
    target_origin_id       = "s3-${var.domain_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  custom_error_response {
    error_code            = var.error_code
    response_page_path    = var.response_page_path
    response_code         = var.response_code
    error_caching_min_ttl = var.error_caching_min_ttl
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = var.ssl_support_method
    minimum_protocol_version = var.minimum_protocol_version
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
