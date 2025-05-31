# Terraform Configuration for AWS Deployment

This directory contains Terraform configuration files to deploy a three-tier application (Angular frontend, ASP.NET Core backend, MySQL database) on AWS.

The infrastructure includes:
-   VPC, Subnets (public and private)
-   Internet Gateway, Route Tables
-   Security Groups
-   AWS ECR (Elastic Container Registry) for Docker images
-   AWS ECS (Elastic Container Service) with Fargate for running frontend and backend services
-   AWS RDS (Relational Database Service) for MySQL
-   AWS Secrets Manager for database credentials
-   AWS ALB (Application Load Balancer) to distribute traffic

## Prerequisites

1.  **AWS Account:** You will need an AWS account.
2.  **AWS CLI:** Installed and configured with credentials that have permissions to create the resources defined in these Terraform files.
    *   Configure with `aws configure`. Ensure your IAM user/role has necessary permissions.
3.  **Terraform:** Installed locally (version 1.x or later recommended).
4.  **Docker:** (Optional, for building and pushing images) Installed locally if you plan to build and push your application images to ECR.
5.  **Git:** For cloning the repository.

## Setup and Configuration

1.  **Clone the Repository:**
    ```bash
    # git clone <your-repository-url>
    # cd <path-to-this-directory>/infras/aws
    ```

2.  **Review Configuration Files:**
    *   `main.tf`: Defines the core AWS resources.
    *   `variables.tf`: Contains variable definitions.
    *   `outputs.tf`: Defines outputs after deployment (e.g., ALB DNS).

3.  **Handle "TODO:" Placeholders and Customize Variables:**

    Several values in `main.tf` and `variables.tf` are marked with `TODO:` or have default values that you **must** review and update for your specific AWS account and application requirements.

    *   **Create a `terraform.tfvars` file:** This is the recommended way to provide values for variables, especially sensitive ones. **Do not commit `terraform.tfvars` if it contains sensitive information.**
        Create a file named `terraform.tfvars` in this directory (`infras/aws`) with the following content, replacing placeholders with your actual values:

        ```hcl
        # Sample terraform.tfvars
        aws_region = "us-east-1" # Or your preferred region
        project_name = "my-web-app" # Choose a unique project name

        # Database Credentials (MUST BE SET)
        db_username = "yourdbadminuser"
        db_password = "YourSecurePassword123!"

        # ACM Certificate ARN for HTTPS (Required if enable_https = true)
        # acm_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/your-certificate-id"

        # KMS Key for Secrets Manager (Optional, uses AWS managed key if left as "TODO:")
        # secrets_manager_kms_key_id = "arn:aws:kms:us-east-1:123456789012:key/your-kms-key-id"

        # Image URIs (Terraform will use the ECR repo URLs by default, but you can override if images are pre-built)
        # frontend_image_uri = "123456789012.dkr.ecr.us-east-1.amazonaws.com/my-web-app/frontend:latest"
        # backend_image_uri  = "123456789012.dkr.ecr.us-east-1.amazonaws.com/my-web-app/backend:latest"

        # Enable HTTPS (set to true if you have an ACM certificate)
        # enable_https = true

        # Other variables you might want to override from variables.tf defaults:
        # vpc_cidr_block                = "10.10.0.0/16"
        # public_subnet_cidr_blocks     = ["10.10.1.0/24", "10.10.2.0/24"]
        # private_subnet_cidr_blocks    = ["10.10.3.0/24", "10.10.4.0/24"]
        # db_instance_class             = "db.t3.small"
        # rds_skip_final_snapshot       = false # For production
        # rds_deletion_protection       = true  # For production
        # alb_enable_deletion_protection = true  # For production
        ```

    *   **AWS Credentials (`provider` block in `main.tf`):**
        The AWS provider block in `main.tf` is commented out for `access_key` and `secret_key`. It's **highly recommended** to configure AWS credentials via:
        *   Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`).
        *   Shared credentials file (`~/.aws/credentials`).
        *   IAM roles for EC2 instances or ECS tasks (preferred for automated environments).
        If you absolutely must use static keys in the provider block (not recommended for security reasons), uncomment and fill them:
        ```terraform
        # provider "aws" {
        #   region     = var.aws_region
        #   access_key = "TODO: Your AWS Access Key"
        #   secret_key = "TODO: Your AWS Secret Key"
        # }
        ```
        **Remove these static credentials before committing your code.**

4.  **Initialize Terraform:**
    This command downloads the necessary provider plugins.
    ```bash
    terraform init
    ```

## Usage

1.  **Format and Validate (Optional but Recommended):**
    ```bash
    terraform fmt
    terraform validate
    ```

2.  **Plan Changes:**
    This command shows you what resources Terraform will create, modify, or destroy. Review the plan carefully.
    ```bash
    terraform plan -var-file="terraform.tfvars"
    ```
    If you didn't create `terraform.tfvars`, you'll be prompted for required variables or you can pass them via `-var` flags.

3.  **Apply Changes:**
    This command provisions the resources in AWS as defined in your configuration.
    ```bash
    terraform apply -var-file="terraform.tfvars" -auto-approve
    ```
    Remove `-auto-approve` to be prompted for confirmation before applying.

4.  **Accessing Outputs:**
    After a successful apply, Terraform will display the defined outputs (see `outputs.tf`). You can also retrieve them later:
    ```bash
    terraform output
    terraform output alb_dns_name
    ```
    The `alb_dns_name` will be the main URL to access your application. The ALB is configured to route `/api/*` paths to the backend and other paths to the frontend.

## Managing Secrets

*   **Database Credentials:** The `db_username` and `db_password` variables are used to create a secret in AWS Secrets Manager. The RDS instance then uses these credentials, and the backend ECS task is configured to read them from Secrets Manager and inject them as environment variables (`DB_USER`, `DB_PASSWORD`, `DB_HOST`).
*   **Application Secrets:** If your applications require other secrets (e.g., API keys), you should:
    1.  Store them in AWS Secrets Manager or AWS Systems Manager Parameter Store.
    2.  Update the IAM role for the ECS tasks (`ecs_app_task_role` in `main.tf`) to grant read access to these secrets.
    3.  Modify the ECS task definitions (`aws_ecs_task_definition.frontend` or `aws_ecs_task_definition.backend` in `main.tf`) to inject these secrets as environment variables or files into your containers.

## Application Deployment (CI/CD - Beyond this Terraform setup)

This Terraform setup provisions the infrastructure. You still need to:

1.  **Build Docker Images:** For your Angular frontend and ASP.NET Core backend.
    *   Frontend: Typically, build the static Angular assets and serve them with a web server like Nginx.
    *   Backend: Build your ASP.NET Core application.
2.  **Push Images to ECR:**
    *   Authenticate Docker with ECR:
        ```bash
        aws ecr get-login-password --region $(terraform output -raw aws_region) | docker login --username AWS --password-stdin $(terraform output -raw frontend_ecr_repository_url | cut -d/ -f1)
        ```
    *   Tag your images with the ECR repository URL (from `terraform output frontend_ecr_repository_url` and `backend_ecr_repository_url`).
    *   Push the images:
        ```bash
        # Example for frontend
        # docker tag my-frontend-image:latest $(terraform output -raw frontend_ecr_repository_url):latest
        # docker push $(terraform output -raw frontend_ecr_repository_url):latest

        # Example for backend
        # docker tag my-backend-image:latest $(terraform output -raw backend_ecr_repository_url):latest
        # docker push $(terraform output -raw backend_ecr_repository_url):latest
        ```
3.  **Update ECS Services:**
    After pushing new images, you need to update the ECS services to use the new image tags. This can be done via the AWS console, AWS CLI, or by updating the task definition and service in Terraform (e.g., by changing an image tag variable if you've set one up) and re-applying. A common CI/CD approach is to use `aws ecs update-service --cluster <cluster-name> --service <service-name> --force-new-deployment`.

## Cleanup

To destroy all resources created by this Terraform configuration:
```bash
terraform destroy -var-file="terraform.tfvars" -auto-approve
```
**Warning:** This will permanently delete all resources, including the RDS database (if `skip_final_snapshot` is true or no final snapshot is taken).

## TODOs and Considerations from `main.tf`

Review the "TODO" comments in `main.tf` and `variables.tf` for production hardening and specific configurations:
*   **HTTPS:** Configure an ACM certificate and enable the HTTPS listener on the ALB for secure communication. Update `var.enable_https` and `var.acm_certificate_arn`.
*   **Domain Name:** Use AWS Route 53 or your DNS provider to point your custom domain to the ALB DNS name.
*   **NAT Gateway:** For Fargate tasks in private subnets to access the internet (e.g., to pull images from Docker Hub or other external services if not using ECR Interface Endpoints), you'll need to add a NAT Gateway and configure routes. The current setup assumes images are in ECR and assign_public_ip is true for the frontend service (if in public subnets) or ECR interface endpoints are configured.
*   **IAM Permissions:** Refine IAM policies for `ecs_app_task_role` to follow the principle of least privilege.
*   **Production Settings:**
    *   `rds_skip_final_snapshot = false`
    *   `rds_deletion_protection = true`
    *   `alb_enable_deletion_protection = true`
    *   Consider Multi-AZ for RDS (`multi_az = true`).
    *   Adjust ECS task counts, CPU, and memory.
*   **Backend Health Check:** Ensure the path in `aws_lb_target_group.backend.health_check.path` (currently `/health`) matches an actual health check endpoint in your backend application.
*   **Logging and Monitoring:** Enhance CloudWatch logging and consider additional monitoring/alarming.
*   **Cost Management:** Be aware of the costs associated with the created AWS resources. Use smaller instance types for development/testing.
```
