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
  default     = "LISA is a web-based tool for crisis and incident management. It helps teams log events, share updates securely, and work together during emergencies, improving coordination and response times."
}

variable "requirement_tracking_url_base" {
  description = "Requirement tracking system URL base to be used for autolinking commit messages."
  type        = string
}

variable "requirement_tracking_id" {
  description = "Requirement identifier to be used for autolinking commit messages. This ID should match those which prefix issue identifiers, for example DPAV."
  type        = string
  default     = "DPAV"
}