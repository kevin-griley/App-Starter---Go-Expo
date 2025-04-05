variable "domain_name" {
  type        = string
  description = "Domain name to use for the S3 bucket"
}

variable "force_destroy" {
  type        = bool
  default     = false
  description = "Whether to forcibly destroy the bucket"
}
