resource "aws_emr_cluster" "this" {
  name = "tf-cluster"
  release_label = "emr-7.8.0"

  applications = ["Spark", "Hadoop", "Hive"]

  ec2_attributes {
    subnet_id = var.subnet_id
    emr_managed_master_security_group = var.master_sg
    emr_managed_slave_security_group = var.core_sg
    instance_profile = var.instance_profile_arn
    service_access_security_group     = var.service_access_sg
  }

  master_instance_group {
    instance_type = "m5.xlarge"
    instance_count = 1
  }

  core_instance_group {
    instance_type = "m5.xlarge"
    instance_count = 2
  }

  service_role = var.service_role_arn
  log_uri      = "s3://${var.log_bucket}/emr-logs/"

step {
  name = "SparkPi Cluster Mode"
  action_on_failure = "CONTINUE"

  hadoop_jar_step {
    jar  = "command-runner.jar"

    args = [
      "spark-submit",
      "--deploy-mode", "cluster",
      "--master", "yarn",
      "--class", "org.apache.spark.examples.SparkPi",
      "/usr/lib/spark/examples/jars/spark-examples.jar",
      "1000"
    ]
  }
}

visible_to_all_users = true
  tags = {
    Name        = "EMR Cluster"
    Environment = "dev"
  }
}

