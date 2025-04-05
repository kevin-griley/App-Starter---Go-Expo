variable "domain_name" {
  type        = string
  description = "Primary domain name"
}

variable "subject_alternative_names" {
  type        = list(string)
  default     = []
  description = "List of subject alternative names (SANs)"
}

variable "hosted_zone_id" {
  type        = string
  description = "The Route53 Hosted Zone ID where DNS validation records will be created"
}