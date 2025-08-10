provider "aws" {
  region = "ap-south-1"
}

# Security Group allowing HTTP and SSH
resource "aws_security_group" "allow_web_ssh" {
  name        = "allow_web_ssh"
  description = "Allow HTTP and SSH"

  ingress {
    description = "Allow HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH"
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

# EC2 instance
resource "aws_instance" "web_server" {
  ami           = "ami-0144277607031eca2" # Amazon Linux 2 in Mumbai
  instance_type = "t2.micro"
  security_groups = [aws_security_group.allow_web_ssh.name]
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "Successfully launched from Terraform" > /var/www/html/index.html
              EOF
}

# Output public IP
output "public_ip" {
  value = aws_instance.web_server.public_ip
}
