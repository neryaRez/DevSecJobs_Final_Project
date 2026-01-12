output "eks_cluster_name" {
  value       = aws_eks_cluster.eks_cluster.name
  description = "The name of the EKS cluster"
}

output "eks_cluster_endpoint" {
  value       = aws_eks_cluster.eks_cluster.endpoint
  description = "The endpoint of the EKS cluster"
}

output "eks_cluster_arn" {
  value       = aws_eks_cluster.eks_cluster.arn
  description = "The ARN of the EKS cluster"
}

output "eks_node_group_name" {
  value       = aws_eks_node_group.eks_nodes.node_group_name
  description = "The name of the Node Group"
}

output "eks_node_role_arn" {
  value       = aws_iam_role.eks_node_role.arn
  description = "The IAM Role ARN of the Node Group"
}
