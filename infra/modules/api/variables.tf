variable "instance_type" {
  description = "EC2 instance type for running the API"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID used for the EC2 instance (ensure this is valid in your region)"
  type        = string
}

variable "key_name" {
  description = "Optional SSH key name for access to the instance"
  type        = string
  default     = ""
}

variable "vpc_id" {
  description = "The VPC ID in which to deploy the instance"
  type        = string
}

variable "subnet_id" {
  description = "The subnet ID to place the instance in"
  type        = string
}

variable "http_port" {
  description = "Port on which the API listens (usually 80)"
  type        = number
  default     = 80
}

variable "user_data" {
  description = "User data script to launch and configure the Golang API"
  type        = string
  default     = ""
}

variable "app_name" {
  description = "Application name to tag the resources"
  type        = string
  default     = "golang-api"
}

variable "api_subdomain" {
  description = "Subdomain prefix for the API record (e.g., \"api\")"
  type        = string
  default     = "api"
}

variable "base_domain" {
  description = "Your base domain (e.g., fleetexpand.com)"
  type        = string
}

variable "hosted_zone_id" {
  description = "The Route53 Hosted Zone ID for the base domain"
  type        = string
}

variable "api_s3_bucket_arn" {
  description = "ARN for the S3 bucket and objects (include /*) that the API instance is allowed to access"
  type        = string
}