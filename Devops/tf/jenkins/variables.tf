variable "key_name" {
  description = "The name of the SSH key pair"
  type        = string
  default     = "jenkins-key"
}
variable "instance_type" {
  description = "The type of instance to use for Jenkins"
  type        = string
  default     = "t3.medium"
}
variable "aws_region" {
  description = "The AWS region to deploy Jenkins"
  type        = string
  default     = "us-east-1"
}
variable "allowed_ssh_cidrs" {
  description = "List of allowed SSH CIDR blocks"
  type        = list(string)
  default     = []
}
variable "allowed_jenkins_cidrs" {
  description = "List of allowed Jenkins CIDR blocks"
  type        = list(string)
  default     = []
}
