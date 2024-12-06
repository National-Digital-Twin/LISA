resource "terraform_data" "check_prevent_destroy" {
  provisioner "local-exec" {
    interpreter = ["bash", "-c"]
    when        = destroy
    on_failure  = fail
    command     = <<EOF
      if [ "$${TF_VAR_prevent_destroy:-true}" != "false" ]; then
        echo 'Destruction has been prevented. Set `TF_VAR_prevent_destroy` (as an external ENV variable) to `false` to enable'
        exit 1
      fi
  EOF
  }

  depends_on = [
    aws_efs_file_system.scg-data,
    aws_s3_bucket.upload_bucket,
  ]
}
