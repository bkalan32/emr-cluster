terraform {
  backend "s3" {
    bucket         = "tf-state-bucket-kalan"       
    key            = "emr-cluster/terraform.tfstate" 
    region         = "us-east-1"                  
    dynamodb_table = "tf-locks-kalan"             
    encrypt        = true
  }
}
