resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "emr-vpc"
  }
}

data "aws_availability_zones" "available" {}

resource "aws_subnet" "private" {
  count = 2
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false
  tags = {
    Name = "emr-private-subnet-${count.index}"
  }
}

resource "aws_security_group" "endpoint_https" {
  name        = "https-endpoint-access"
  description = "Allow HTTPS for VPC endpoints"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "https-sg"
  }
}

resource "aws_security_group" "emr_master" {
  name        = "emr-master-sg"
  description = "Security group for EMR master node"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "EMR Master SG"
  }
}

resource "aws_security_group" "emr_core" {
  name        = "emr-core-sg"
  description = "Security group for EMR core nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "EMR Core SG"
  }
}


resource "aws_security_group" "emr_service_access" {
  name        = "emr-service-access"
  description = "Allows EMR internal service communication"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow EMR master on port 9443"
    from_port       = 9443
    to_port         = 9443
    protocol        = "tcp"
    security_groups = [aws_security_group.emr_master.id]  # ✅ allow from master SG
  }

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "EMR Service Access"
  }
}


resource "aws_vpc_endpoint" "s3" {
  vpc_id = aws_vpc.main.id
  service_name = "com.amazonaws.${var.region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids = [aws_vpc.main.default_route_table_id]

  tags = {
    Name = "s3-endpoint"
  }
}

resource "aws_vpc_endpoint" "ssm" {
  vpc_id = aws_vpc.main.id
  service_name = "com.amazonaws.${var.region}.ssm"
  vpc_endpoint_type = "Interface"
  subnet_ids = aws_subnet.private[*].id
  security_group_ids = [aws_security_group.endpoint_https.id]
}

resource "aws_vpc_endpoint" "ec2messages" {
  vpc_id = aws_vpc.main.id
  service_name = "com.amazonaws.${var.region}.ec2messages"
  vpc_endpoint_type = "Interface"
  subnet_ids = aws_subnet.private[*].id
  security_group_ids = [aws_security_group.endpoint_https.id]
}

resource "aws_vpc_endpoint" "ssmmessages" {
  vpc_id = aws_vpc.main.id
  service_name = "com.amazonaws.${var.region}.ssmmessages"
  vpc_endpoint_type = "Interface"
  subnet_ids = aws_subnet.private[*].id
  security_group_ids = [aws_security_group.endpoint_https.id]
}