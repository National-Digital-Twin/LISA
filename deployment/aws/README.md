

The `common` folder contains definitions of common resources that can be shared between environments, such as
docker repository (ECR), VPC and ALB.

Note that environments do not have to use the shared resources, because the actual definitions are in `modules`.
If an environment needs a separate VPC for instance, it can just use the `vpc` module instead of referring to the
one defined in `common`.

The `envs/dev` environment is special in a way that it does not deploy the app, but rather creates necessary
resources (such as Coginto user pool and S3 bucket for attachment uploads) for local developer environments.

# Deployment

To deploy from scratch:

1. Make sure Docker and Terraform are installed.
2. Import the scg docker image locally:

```shell
gzip -dc scg-0.80.0.tar.gz | docker load
```

3. Apply terraform in the `common` folder:

```shell
cd common && terraform init && terraform apply
 ```

4. Build and publish SCG Docker image:

```shell
cd ../scg-with-config && ./build.sh && ./publish.sh
```

5. Make sure the app is built:

```shell
cd ../.. && npm run ci && npm run bundle
```

6. Build and publish the app Docker image:

```shell
cd ../docker && ./build.sh && ./publish.sh
```

Note the revision tag.

7. Deploy an environment:

```shell
cd envs/... && terraform apply -var webapp_tag=<revision>
```
