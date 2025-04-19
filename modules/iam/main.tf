data "aws_iam_policy_document" "emr_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["elasticmapreduce.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "emr_service_role" {
  name               = "EMR_DefaultRole"
  assume_role_policy = data.aws_iam_policy_document.emr_assume.json
}

resource "aws_iam_role_policy_attachment" "emr_service_attach" {
  role       = aws_iam_role.emr_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonElasticMapReduceRole"
}

data "aws_iam_policy_document" "ec2_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "emr_ec2_role" {
  name               = "EMR_EC2_DefaultRole"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume.json
}

resource "aws_iam_role_policy_attachment" "emr_ec2_attach" {
  role       = aws_iam_role.emr_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonElasticMapReduceforEC2Role"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "EMR_EC2_DefaultProfile"
  role = aws_iam_role.emr_ec2_role.name
}

resource "aws_iam_role_policy_attachment" "emr_ec2_s3_full" {
  role       = aws_iam_role.emr_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}
