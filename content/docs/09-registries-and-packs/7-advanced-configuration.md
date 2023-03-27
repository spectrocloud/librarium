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

## Storage Backend

## Authentication

## TLS

## HTTP

## Logging

## Alerting


