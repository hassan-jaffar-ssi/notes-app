provider "kubernetes" {
	config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "app_ns" {
	metadata {
		name = var.namespace
	}
}

resource "null_resource" "apply_kustomize" {
	provisioner "local-exec" {
		environment = {
			INGRESS_HOST = var.ingress_host
		}

		command = <<EOT
			# Create a backup of the original ingress.yaml
			cp ../k8s/ingress.yaml ../k8s/ingress.yaml.bak
			
			# Replace placeholder with actual hostname
			envsubst < ../k8s/ingress.yaml.bak > ../k8s/ingress.yaml

			# Apply all resources
			kubectl apply -k ../k8s --namespace ${var.namespace}

			# Restore original ingress.yaml
			mv ../k8s/ingress.yaml.bak ../k8s/ingress.yaml

		EOT
	}

	triggers = {
		ingress_host = var.ingress_host
	}

	depends_on = [kubernetes_namespace.app_ns]
}
