variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "domain_name" {
  type    = string
  default = "fleetexpand.com"
}

variable "hosted_zone_id" {
  type    = string
  default = "Z077407534K6DRHPPX64Y"
}

variable "api_ami_id" {
  description = "AMI ID for the API EC2 instance. Ensure this is available in your region."
  type        = string
  default     = "ami-00a929b66ed6e0de6"
}

variable "key_name" {
  description = "EC2 Key Pair name (if needed)"
  type        = string
  default     = ""
}

variable "vpc_id" {
  type    = string
  default = "vpc-0ab2d9fd4c54b4faa"
}

variable "subnet_id" {
  type    = string
  default = "subnet-05f36a7d4bfc4d4f0"
}
