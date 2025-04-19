variable "subnet_id" {
  type = string
}

variable "master_sg" {
  type = string
}

variable "core_sg" {
  type = string
}

variable "log_bucket" {
  type = string
}

variable "service_role_arn" {
  type = string
}

variable "instance_profile_arn" {
  type = string
}

variable "service_access_sg" {
  description = "Security group for EMR service communication between nodes"
  type        = string
}
