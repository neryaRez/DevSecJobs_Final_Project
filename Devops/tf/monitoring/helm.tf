resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }
}

resource "helm_release" "kube_prometheus_stack" {
  name      = "kube-prometheus-stack"
  namespace = kubernetes_namespace.monitoring.metadata[0].name

  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"

  version         = "81.1.0"
  timeout         = 900
  atomic          = true
  cleanup_on_fail = true

  values = [
    file("${path.module}/values.yaml")
  ]


}
