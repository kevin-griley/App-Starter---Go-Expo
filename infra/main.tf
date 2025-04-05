terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Module: ACM
module "acm" {
  source = "./modules/acm"

  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  hosted_zone_id            = var.hosted_zone_id
}

# Module: S3
module "s3" {
  source = "./modules/s3"

  domain_name   = var.domain_name
  force_destroy = true
}

# Module: CloudFront
module "cloudfront" {
  source = "./modules/cloudfront"

  domain_name                 = var.domain_name
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  origin_access_identity      = module.s3.origin_access_identity
  certificate_arn             = module.acm.certificate_arn
  aliases                     = [var.domain_name, "www.${var.domain_name}"]
}

# Module: Route53
module "route53" {
  source = "./modules/route53"

  hosted_zone_id     = var.hosted_zone_id
  domain_name        = var.domain_name
  cdn_domain_name    = module.cloudfront.distribution_domain_name
  cdn_hosted_zone_id = module.cloudfront.distribution_hosted_zone_id
}