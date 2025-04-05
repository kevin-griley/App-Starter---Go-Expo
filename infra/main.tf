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

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# Module: ACM
module "acm" {
  source = "./modules/acm"
  providers = {
    aws = aws.us_east_1
  }

  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}", "api.${var.domain_name}"]
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


# REBOOT - terraform taint module.api.aws_instance.api_instance
# Module: API
module "api" {
  source = "./modules/api"

  instance_type     = "t2.micro"
  ami_id            = var.api_ami_id
  key_name          = var.key_name
  vpc_id            = var.vpc_id
  subnet_id         = var.subnet_id
  user_data         = file("startup.sh")
  http_port         = 80
  app_name          = "golang-api"
  api_subdomain     = "api"
  base_domain       = var.domain_name
  hosted_zone_id    = var.hosted_zone_id
  api_s3_bucket_arn = "arn:aws:s3:::golang-private-api"
}

resource "null_resource" "wait_for_api" {
  provisioner "local-exec" {
    command = <<EOT
    for i in {1..10}; do
      if curl --fail -s http://${module.api.instance_public_dns}/health > /dev/null; then
        exit 0
      fi
      sleep 10
    done
    exit 1
EOT
  }

  depends_on = [module.api]
}

module "cloudfront_api" {
  source = "./modules/cloudfront_api"

  certificate_arn    = module.acm.certificate_arn
  api_subdomain      = "api"
  domain_name        = var.domain_name
  origin_domain_name = module.api.instance_public_dns
  hosted_zone_id     = var.hosted_zone_id
  create_dns_record  = true
  allowed_methods    = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"]
  ssl_support_method = "sni-only"

  depends_on = [null_resource.wait_for_api]
}
