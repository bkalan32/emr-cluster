output "emr_service_role_arn" {
  value = aws_iam_role.emr_service_role.arn
}

output "ec2_instance_profile_arn" {
  value = aws_iam_instance_profile.ec2_profile.arn
}
