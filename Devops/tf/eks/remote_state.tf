data "terraform_remote_state" "jenkins" {
  backend = "local"
  config = {
    path = "../jenkins/terraform.tfstate"
  }
}
