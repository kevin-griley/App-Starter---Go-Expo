variable "certificate_arn" {
  description = "ARN of the validated ACM certificate that includes api.{domain_name}"
  type        = string
}

variable "api_subdomain" {
  description = "Subdomain for the API (e.g. 'api')"
  type        = string
  default     = "api"
}

variable "domain_name" {
  description = "Base domain name (e.g., fleetexpand.com)"
  type        = string
}

variable "origin_domain_name" {
  description = "Domain name (or public IP) of the API origin (the EC2 instance). Could be an EIP (e.g. 1.2.3.4) or public DNS."
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 Hosted Zone ID for the base domain"
  type        = string
}

variable "create_dns_record" {
  description = "Whether to create a Route53 alias record for api.subdomain"
  type        = bool
  default     = true
}

variable "default_root_object" {
  description = "The default root object in CloudFront (not typically used for an API, but must be set if required)"
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "allowed_methods" {
  description = "Allowed methods for CloudFront to forward to the origin"
  type        = list(string)
  default     = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
}

variable "cached_methods" {
  description = "Cached methods for CloudFront"
  type        = list(string)
  default     = ["GET", "HEAD"]
}

variable "ssl_support_method" {
  description = "SSL support method for the viewer certificate"
  type        = string
  default     = "sni-only"
}

variable "minimum_protocol_version" {
  description = "Minimum SSL protocol version"
  type        = string
  default     = "TLSv1.2_2019"
}