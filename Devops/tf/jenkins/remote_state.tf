data "terraform_remote_state" "eks" {
  backend = "local"
  config = {
    path = "../eks/terraform.tfstate"
  }
}

data "http" "my_ip" {
  url = "https://checkip.amazonaws.com"
}

locals {
  vpc_id           = data.terraform_remote_state.eks.outputs.vpc_id
  public_subnet_id = data.terraform_remote_state.eks.outputs.public_subnet_ids[0]
  cluster_name     = data.terraform_remote_state.eks.outputs.eks_cluster_name

  my_ip_cidr = "${chomp(data.http.my_ip.response_body)}/32"
  ssh_cidrs = distinct(concat(
    var.allowed_ssh_cidrs,
    [local.my_ip_cidr]
  ))
  jenkins_cidrs = distinct(concat(
    var.allowed_jenkins_cidrs,
    [local.my_ip_cidr]
  ))
}
