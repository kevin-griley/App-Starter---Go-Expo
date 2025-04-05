variable "certificate_arn" {
  type        = string
  description = "ARN of the validated ACM certificate"
}

variable "aliases" {
  type        = list(string)
  default     = []
  description = "Aliases for the CloudFront distribution"
}

variable "domain_name" {
  type        = string
  description = "Domain name (used to generate origin_id, etc.)"
}

variable "bucket_regional_domain_name" {
  type        = string
  description = "The S3 bucket's regional domain name"
}

variable "origin_access_identity" {
  type        = string
  description = "CloudFront origin access identity path"
}

variable "default_root_object" {
  type    = string
  default = "index.html"
}

variable "price_class" {
  type    = string
  default = "PriceClass_100"
}

variable "error_code" {
  type    = number
  default = 403
}

variable "response_page_path" {
  type    = string
  default = "/index.html"
}

variable "response_code" {
  type    = number
  default = 200
}

variable "error_caching_min_ttl" {
  type    = number
  default = 300
}

variable "ssl_support_method" {
  type    = string
  default = "sni-only"
}

variable "minimum_protocol_version" {
  type    = string
  default = "TLSv1.2_2019"
}