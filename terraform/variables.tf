variable "namespace" {
	description = "The kubernetes namespace to deploy to"
	type = string
}

variable "replica_count" {
	description = "Replica count for app deployments (future use)"
	type = number
	default = 1
}

variable "ingress_host" {
	description = "Ingress hostname to use in the inress resource"
	type = string
}
