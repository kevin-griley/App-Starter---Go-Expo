variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "domain_name" {
  type    = string
  default = "fleetexpand.com"
}

# If you already know your hosted_zone_id, you can hard-code or set via CLI:
variable "hosted_zone_id" {
  type    = string
  default = "Z077407534K6DRHPPX64Y"
}