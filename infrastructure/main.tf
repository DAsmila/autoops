terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ─── Variables ────────────────────────────────────────────────────────────────
variable "aws_region"    { default = "ap-south-1" }
variable "instance_type" { default = "t3.medium" }
variable "app_name"      { default = "autoops" }

# ─── VPC ─────────────────────────────────────────────────────────────────────
resource "aws_vpc" "autoops_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "${var.app_name}-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.autoops_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags = { Name = "${var.app_name}-public-subnet" }
}

# ─── Security Group ───────────────────────────────────────────────────────────
resource "aws_security_group" "autoops_sg" {
  name   = "${var.app_name}-sg"
  vpc_id = aws_vpc.autoops_vpc.id

  ingress {
    from_port   = 22;  to_port = 22;   protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80;  to_port = 80;   protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 3000; to_port = 3001; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 5000; to_port = 5000; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 9090; to_port = 9090; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.app_name}-sg" }
}

# ─── EC2 Instance ─────────────────────────────────────────────────────────────
resource "aws_instance" "autoops_server" {
  ami                    = "ami-0f5ee92e2d63afc18"  # Ubuntu 22.04 ap-south-1
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.autoops_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io docker-compose-plugin
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ubuntu
    cd /home/ubuntu
    git clone https://github.com/autoops/app.git
    cd app
    docker compose up -d
  EOF

  tags = { Name = "${var.app_name}-server", Env = "production" }
}

# ─── S3 Bucket for artifacts ──────────────────────────────────────────────────
resource "aws_s3_bucket" "artifacts" {
  bucket = "${var.app_name}-artifacts-${random_id.bucket_id.hex}"
  tags   = { Name = "${var.app_name}-artifacts" }
}

resource "random_id" "bucket_id" { byte_length = 4 }

# ─── Outputs ─────────────────────────────────────────────────────────────────
output "server_ip"    { value = aws_instance.autoops_server.public_ip }
output "app_url"      { value = "http://${aws_instance.autoops_server.public_ip}:3000" }
output "grafana_url"  { value = "http://${aws_instance.autoops_server.public_ip}:3001" }
