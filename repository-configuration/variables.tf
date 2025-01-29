variable "token" {
  description = "GitHub personal access token."
  type        = string
  sensitive   = true
}

variable "organisation" {
  description = "The GitHub organisation name."
  type        = string
  default     = "National-Digital-Twin"
}

variable "repository_description" {
  description = "GitHub repository description."
  type        = string
  default     = ""
}