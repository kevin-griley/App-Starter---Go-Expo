resource "aws_iam_role" "api_instance_role" {
  name = "${var.app_name}-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

data "aws_iam_policy_document" "api_policy" {
  statement {
    sid    = "AllowS3ReadAccess"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:ListBucket",
      "s3:GetObjectVersion",
      "s3:GetObjectAcl",
      "s3:HeadObject"
    ]

    resources = [
      var.api_s3_bucket_arn,
      "${var.api_s3_bucket_arn}/*"
    ]
  }
}

resource "aws_iam_role_policy" "api_policy" {
  name   = "${var.app_name}-api-policy"
  role   = aws_iam_role.api_instance_role.id
  policy = data.aws_iam_policy_document.api_policy.json
}

resource "aws_iam_instance_profile" "api_instance_profile" {
  name = "${var.app_name}-instance-profile"
  role = aws_iam_role.api_instance_role.name
}

resource "aws_security_group" "api_sg" {
  name        = "${var.app_name}-sg"
  description = "Security group for the Golang API instance allowing HTTP access"
  vpc_id      = var.vpc_id

  # Allow HTTP access
  ingress {
    description = "Allow HTTP traffic"
    from_port   = var.http_port
    to_port     = var.http_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow SSH for EC2 Instance Connect
  ingress {
    description = "Allow SSH access (for Instance Connect)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "api_instance" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = var.key_name != "" ? var.key_name : null
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [aws_security_group.api_sg.id]
  associate_public_ip_address = true
  user_data                   = var.user_data

  iam_instance_profile = aws_iam_instance_profile.api_instance_profile.name

  tags = {
    Name        = "${var.app_name}-instance"
    Application = var.app_name
  }
}

resource "aws_eip" "api_eip" {
  vpc      = true
  instance = aws_instance.api_instance.id
}
