resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"

  # אתה כבר יוצר SA עם IRSA (alb_sa.tf), אז לא לתת ל-Helm ליצור אחד חדש
  set {
    name  = "serviceAccount.create"
    value = "false"
  }
  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  set {
    name  = "clusterName"
    value = aws_eks_cluster.eks_cluster.name
  }

  # מומלץ כדי למנוע autodiscovery מוזר
  set {
    name  = "region"
    value = var.aws_region
  }
  set {
    name  = "vpcId"
    value = aws_vpc.eks_vpc.id
  }

  depends_on = [
    module.alb_controller_irsa,
    kubernetes_service_account.alb_controller
  ]
}
