module "vpc" {
  source = "./modules/vpc"
  region = "us-east-1"

}

module "iam" {
  source = "./modules/iam"
}

module "log_bucket" {
  source      = "./modules/log-bucket"
  bucket_name = "barnesnest-emr-logs"
}

module "emr" {
  source               = "./modules/emr"
  subnet_id            = module.vpc.private_subnet_ids[0]
  master_sg = module.vpc.emr_master_sg_id
  core_sg   = module.vpc.emr_core_sg_id
  log_bucket           = module.log_bucket.bucket_name
  service_role_arn     = module.iam.emr_service_role_arn
  instance_profile_arn = module.iam.ec2_instance_profile_arn
  service_access_sg    = module.vpc.emr_service_access_sg_id
}

