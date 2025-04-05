variable "hosted_zone_id" {
  type        = string
  description = "Route53 hosted zone ID"
}

variable "domain_name" {
  type        = string
  description = "Main domain name"
}

variable "cdn_domain_name" {
  type        = string
  description = "The AWS CloudFront distribution domain name"
}

variable "cdn_hosted_zone_id" {
  type        = string
  description = "The CloudFront distribution's hosted zone ID"
}