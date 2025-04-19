variable "bucket_name" {
  description = "Name of the S3 bucket for stroing state"
  type = string
}

variable "lock_table_name" {
  description = "Name of the DynamoDB table for state locking"
  type = string
}