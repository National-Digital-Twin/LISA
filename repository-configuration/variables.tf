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

variable "jira_project_id" {
  description = "Atlassian JIRA project identifier to be used for autolinking commit messages. This ID should match those which prefix issue identifiers, for example DPAV."
  type        = string
  default     = "DPAV"
}