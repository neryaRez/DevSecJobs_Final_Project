data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

locals {
  user_data = <<-EOF
  #!/bin/bash
  set -eux

  apt-get update -y
  apt-get install -y git curl unzip ca-certificates gnupg lsb-release

  # Docker
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker jenkins || true

  # Jenkins
  curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key \
    | tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
  echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ \
    > /etc/apt/sources.list.d/jenkins.list

  apt-get update -y
  apt-get install -y openjdk-17-jre jenkins
  systemctl enable --now jenkins

  # AWS CLI
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o aws.zip
  unzip -q aws.zip && ./aws/install

  # kubectl
  curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
  install -m 0755 kubectl /usr/local/bin/kubectl
  EOF
}

resource "aws_instance" "jenkins" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = local.public_subnet_id
  vpc_security_group_ids      = [aws_security_group.jenkins_sg.id]
  key_name                    = var.key_name
  iam_instance_profile        = aws_iam_instance_profile.jenkins.name
  associate_public_ip_address = true
  user_data                   = local.user_data

  tags = { Name = "jenkins-trusted-ec2" }
}
