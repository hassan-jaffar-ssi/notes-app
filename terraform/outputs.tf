output "namespace" {
	value = kubernetes_namespace.app_ns.metadata[0].name
}
