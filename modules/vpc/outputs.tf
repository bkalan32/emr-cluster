output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "emr_service_access_sg_id" {
  value = aws_security_group.emr_service_access.id
}

output "emr_master_sg_id" {
  value = aws_security_group.emr_master.id
}

output "emr_core_sg_id" {
  value = aws_security_group.emr_core.id
}
