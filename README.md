# EMR Cluster Infrastructure on AWS (Terraform)

This project automates the deployment of a production-ready Amazon EMR cluster on AWS using Terraform. It includes the full setup of networking, IAM, state management, and job execution logic. The infrastructure is designed to run in a secure private subnet with no public exposure, using AWS Systems Manager for connectivity.

---

## What’s Included

### 1. Remote State Management
- An S3 bucket is provisioned to store the `terraform.tfstate` file
- A DynamoDB table is used for state locking to avoid race conditions during deployments

### 2. VPC Networking
- A custom VPC with a `/16` CIDR block
- Two private subnets across different availability zones
- A Gateway VPC endpoint for Amazon S3
- Three Interface VPC endpoints for SSM:
  - `ssm`
  - `ec2messages`
  - `ssmmessages`
- Security groups for HTTPS access and EMR service communication

### 3. IAM Roles
- `EMR_DefaultRole` — the EMR service role used by the control plane
- `EMR_EC2_DefaultRole` — assigned to EMR EC2 instances
- S3 Full Access is attached to the EC2 role to allow:
  - Reading bootstrap scripts from S3
  - Writing logs and job output back to S3
- An Instance Profile (`EMR_EC2_DefaultProfile`) links the EC2 role to instances

### 4. Log Bucket Setup
- A dedicated S3 bucket (e.g., `barnesnest-emr-logs`) is created to:
  - Store EMR application logs under `/emr-logs/`
  - Host job submission scripts under `/scripts/`
- Bucket configuration includes:
  - Server-side encryption with AES-256
  - Versioning enabled for log integrity and rollback
- EMR is configured to write logs directly to this bucket using the `log_uri` parameter

### 5. EMR Cluster
- Cluster is launched using EMR 7.0.0
- Applications installed: Spark, Hadoop, and Hive
- Configuration:
  - 1 master node (`m5.xlarge`)
  - 2 core nodes (`m5.xlarge`)
  - Runs inside a private subnet
- A step is added to automatically run a Spark job using `spark-submit`:

```bash
spark-submit \
  --deploy-mode cluster \
  --master yarn \
  --class org.apache.spark.examples.SparkPi \
  /usr/lib/spark/examples/jars/spark-examples.jar 1000

