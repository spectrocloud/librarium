---
title: 'Advanced Registry configuration'
metaTitle: 'Advanced Registry configuration'
metaDescription: 'Customizing deployments of Spectro Registry'
icon: ''
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Advanced Configuration of Spectro Registry

You can modify a few deployment options of the Spectro Registy.
Configuration is done by a YAML file, however you can override 
many options using environment variables.

The YAML file is divided into keys and values, which can have
embedded keys and values, such as:

```
version: 0.1
log:
  level: info
  fields:
    environment: test
```


The key `version` has number value. The `log` key has value with multiple keys (`level`,
`fields`), which in turn have more keys.

To override the value of `log.level` you can specify an environment variable named
`REGISTRY_LOG_LEVEL`.

## The default configuration

The docker image for the registy contains the following configuration:

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
You can override this configuration by overriding specific values via environment
variables or you can pass your own configuration file.

For example you can run the docker container image with the following environment
variables to override the basic auth realm and logging level:

```bash
docker run -d \
    -p 443:5000 \
    ...
    -e REGISTRY_LOG_LEVEL=debug \
    -e REGISTRY_AUTH=htpasswd \
    -e REGISTRY_AUTH_HTPASSWD_REALM="My Enterprise Realm" \
    ...
    gcr.io/spectro-images-public/release/spectro-registry:3.2.0
```

Alternatively, you can run the image mounting a directory with a new configuration
file and pointing the server command to it:

```
docker run -d \
    -p 443:5000 \
    ...
    -v $(pwd)/myconfig.yml:/etc/myconfig.yml
    ...
    gcr.io/spectro-images-public/release/spectro-registry:3.2.0
    /registry serve /etc/myconfig.yml
```
## Storage Backend

The pax registry can store data on a file system through a mounted
volume or it can use S3 storage (AWS or similar).

The following shows a file system backend:

```
storage:
  cache:
    blobdescriptor: inmemory
  filesystem:
    rootdirectory: /tmp/registry//data/.spectro-server
```

S3 Storage needs to know how to connect to S3:

```
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

Ephemeral storage for testing purposes is also available:
```
storage: inmemory
```

## Authentication

Basic HTTP Auth is supported:

```
auth:
  htpasswd:
    realm: basic-realm
    path: /auth/htpasswd-basic
```

## HTTP

The following options are available for modifying HTTP transport:

### Server and Port

For serving content on all interfaces on port 5000:

```
http:
    addr: :5000
```
Alternatively one can bing to a single IP and different port:

```
http:
    addr: 192.168.122.77:25000
```
### HTTP Headers

The following headers are the default, and can be overriden:
```
http:
  headers:
    X-Content-Type-Options: [ nosniff ]
    Strict-Transport-Security: [ max-age=63072000; includeSubdomains; preload ]
    Content-Security-Policy: [ img-src 'self'; script-src 'self';  style-src 'self ]
    X-Frame-Options: [ DENY ]
    X-XSS-Protection: [ 1; mode=block ]
    Referrer-Policy: [ same-origin ]

### TLS

TLS can be configured using [letsencrypt](https://letsencrypt.org) or custom TLS certificates:

For letsencrypt, your registry has to have a public IP address accessible for HTTP based
validation by letsencrypt services.

```
http:
  addr: :5000
  tls:
    letsencrypt:
      cachefile: le-cache
      email: oz@spectrocloud.com
      hosts:
      - pax-registry.spectrocloud.com
```

Note, letsencrypt limits the amount of free certificates issued per domain per amount of time.
It is therefore, recommended to mount a volume where the certificates are permanently stored.
This option is `cachefile` which is actually a directory, despite the name.

Custom certificates can be specified with:

```
http:
  tls:
    certificate: /path/to/x509/certificate/file
    key: /pat/to/x509/key/file/which contains/private key/for x509 certificate above
    clientcas: /path/to/file/with one or more/CA certificates encoded as PEM
    minimumtls: minimum tls version to use
```
