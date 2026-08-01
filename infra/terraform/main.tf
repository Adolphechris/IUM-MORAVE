// Terraform starter template for AWS (example)
// Fill variables in terraform.tfvars before apply

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

resource "aws_s3_bucket" "assets" {
  bucket = var.assets_bucket_name
  acl    = "private"
}

resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "14"
  instance_class       = "db.t3.micro"
  name                 = var.db_name
  username             = var.db_user
  password             = var.db_password
  skip_final_snapshot  = true
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "assets_bucket" {
  value = aws_s3_bucket.assets.bucket
}
