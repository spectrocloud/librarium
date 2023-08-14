---
title: 'Advanced Configuration'
metaTitle: 'Advanced Configuration'
metaDescription: 'Learn how to apply advanced concepts by customizing the deployments of the Packs registry.'
icon: ''
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Advanced Configuration

You can modify the deployment of the pack registry by providing a YAML configuration file. You can also override default configuration options through the usage of environment variables.

The configuration file is divided into keys and values. The following is an example of a YAML configuration.

<br />

```yaml
version: 0.1
log:
  level: info
  fields:
    environment: test
```


The key `version` has a number value. The `log` key has a value with multiple keys, which in turn have more keys.

To override the value of `log.level` you can specify an environment variable named
`REGISTRY_LOG_LEVEL`.

<br />

```shell
export REGISTRY_LOG_LEVEL=debug
```

<br />

## Default Configuration

The docker image for the registry contains the following default configuration values.

<br />

```yaml
version: 0.1
log:
  fields:
    service: registry
storage:
  cache:
    blobdescriptor: inmemory
  filesystem:
    rootdirectory: /data/.spectro-server
http:
  addr: :5000
  headers:
    X-Content-Type-Options: [ nosniff ]
    Strict-Transport-Security: [ max-age=63072000; includeSubdomains; preload ]
    Content-Security-Policy: [ img-src 'self'; script-src 'self';  style-src 'self ]
    X-Frame-Options: [ DENY ]
    X-XSS-Protection: [ 1; mode=block ]
    Referrer-Policy: [ same-origin ]
auth:
  htpasswd:
    realm: basic-realm
    path: /auth/htpasswd-basic
```

The server is started with the command `registy serve /etc/spectro/config.yml`.
You can override the default values with specific values through environment
variables, or you can use your own configuration file.

For example, you can start the docker container image with the following environment by using the
variables to override the basic auth realm and logging level. In the following example, the `-e` flag is used to provide environment variables to the container.

<br />

```bash
docker run -d \
    --rm \
    --port 443:5000 \
    --name spectro-registry\
    --volume $(pwd)/spectropaxconfig/:/etc/spectropaxconfig/
    -e REGISTRY_LOG_LEVEL=debug \
    -e REGISTRY_AUTH=htpasswd \
    -e REGISTRY_AUTH_HTPASSWD_REALM="My Enterprise Realm" \
    gcr.io/spectro-images-public/release/spectro-registry:3.4.0
```

Alternatively, you can start the container by mounting a directory with a new configuration file and pointing the server command to the configuration file.

<br />

```shell
docker run -d \
    --rm \
    --port 443:5000 \
    --name spectro-registry \
    --volume $(pwd)/myconfig.yml:/etc/myconfig.yml \
    gcr.io/spectro-images-public/release/spectro-registry:3.4.0 \
    serve /etc/spectropaxconfig/myconfig.yml
```
## Storage Backend

The pack registry can store data on a file system through a mounted
volume, or you can specify object storage such as AWS S3.

The following is an example of a configuration using a file system backend.

```yaml
storage:
  cache:
    blobdescriptor: inmemory
  filesystem:
    rootdirectory: /tmp/registry/data/.spectro-server
```

If you are using S3 Storage, ensure you specify the required S3 parameters.

<br />

```yaml
storage:
  cache:
    blobdescriptor: inmemory
  s3:
    region: us-east-1
    bucket: my-bucket
    rootdirectory: /registry
    encrypt: true|false
    secure: false|true
    accesskey: SAMPLEACCESSKEY
    secretkey: SUPERSECRET
    host: OPTIONAL_MINIO_HOST_IF_USING
    port: OPTIONAL_MINIO_PORT_IF_USING
```

You can also use ephemeral storage. We recommend using ephemeral storage for testing purposes. Production environments should use object storage or a file system.

<br />

```yaml
storage: inmemory
```

## Authentication

You can configure basic HTTP Auth. Basic Auth requires providing the pack registry server with an httppasswd file containing the credentials.

<br />

```yaml
auth:
  htpasswd:
    realm: basic-realm
    path: /auth/htpasswd-basic
```

## HTTP

The following options are available for modifying HTTP transport:

### Server and Port

For serving content on all interfaces on port 5000:

<br />

```yaml
http:
    addr: :5000
```
Alternatively, the server can bind to a single IP and different port:

<br />

```yaml
http:
    addr: 192.168.122.77:25000
```
### HTTP Headers

The following headers are the default, and can be overridden:

<br />

```yaml
http:
  headers:
    X-Content-Type-Options: [ nosniff ]
    Strict-Transport-Security: [ max-age=63072000; includeSubdomains; preload ]
    Content-Security-Policy: [ img-src 'self'; script-src 'self';  style-src 'self ]
    X-Frame-Options: [ DENY ]
    X-XSS-Protection: [ 1; mode=block ]
    Referrer-Policy: [ same-origin ]
```
### TLS

TLS can be configured using [Let's Encrypt](https://letsencrypt.org) or custom TLS certificates:

When using Let's Encrypt, your registry server must be assigned to a public IP address accessible for HTTP-based validation by the Let's Encrypt services. Check out the [Deploy Pack Registry Server with Let's Encrypt](/registries-and-packs/adding-a-custom-registry#deploypackregistryserverwithletsencrypt) guide to learn more.

<br />

```yaml
http:
  addr: :5000
  tls:
    letsencrypt:
      cachefile: le-cache
      email: oz@spectrocloud.com
      hosts:
      - pax-registry.spectrocloud.com
```

Let's Encrypt limits the number of free certificates issued for each domain for a set time.
We recommend you mount a volume where the certificates are permanently stored. Use the
option `cachefile` to enable this behavior.

You can specify custom certificates by providing the file path to the certificate files.

<br />

```yaml
http:
  tls:
    certificate: /path/to/x509/certificate/file
    key: /pat/to/x509/key/file/which contains/private key/for x509 certificate above
    clientcas: /path/to/file/with one or more/CA certificates encoded as PEM
    minimumtls: minimum tls version to use
```
