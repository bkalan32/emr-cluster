# General
region = "us-east-1"

# S3 log bucket
bucket_name = "barnesnest-emr-logs"

# VPC
vpc_cidr = "10.0.0.0/16"

# EMR instance types
master_instance_type = "m5.xlarge"
core_instance_type   = "m5.xlarge"

# EMR instance counts
master_instance_count = 1
core_instance_count   = 2

# IAM role names (used for reference if creating manually or externally)
emr_service_role_name      = "EMR_DefaultRole"
emr_ec2_role_name          = "EMR_EC2_DefaultRole"
emr_ec2_instance_profile   = "EMR_EC2_DefaultProfile"
