---
title: "Database Services"
metaTitle: "Palette Dev Engine Database Services"
metaDescription: "Explore Palette Dev Engine Database Services"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Palette Dev Engine facilitates database service setup, operation, and scaling without installing physical hardware, software, or performance configurations. Instead, all the administrative and maintenance tasks are taken care of by Palette so that you can use and access the database quickly. Palette also offers control preferences based on the database service provider offerings and your preferences.

Palette Dev Engine supports the following database services:

* [MongoDB]()


* [MySQL]()


* [PostgreSQL]()


* [Redis]()

## DB Deployment 

Palette leverages several Kubernetes built-in workload resources such as Deployment, ReplicaSet, DaemondSet, StatefulSet, etc. 

To take advantage of the persistence of the data storage, Palette deploys DB services as [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).StatefulSet lets you run one or more related Pods that do track state. The DB Service workload records data persistently; therefore, Palette runs a StatefulSet that matches each Pod with a [PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). The DB service running in the Pods for that StatefulSet can replicate data to other Pods in the same StatefulSet to improve the overall resilience of the service.

Refer to an example stateful set Yaml below:

```yaml
{{- $appVersion := .Chart.AppVersion -}}
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ include "mysql-operator.fullname" . }}
  labels:
    {{- include "mysql-operator.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  serviceName: {{ include "orchestrator.fullname" . }}
  podManagementPolicy: Parallel
  selector:
    matchLabels:
      {{- include "mysql-operator.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
      {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
      {{- end }}
        checksum/orchestrator-config: {{ include (print $.Template.BasePath "/orchestrator-config.yaml") . | sha256sum }}
        checksum/orchestrator-secret: {{ include (print $.Template.BasePath "/orchestrator-secret.yaml") . | sha256sum }}
      labels:
        {{- include "mysql-operator.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "mysql-operator.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: operator
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default $appVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 8080
              name: prometheus
              protocol: TCP
          env:
            - name: ORC_TOPOLOGY_USER
              valueFrom:
                secretKeyRef:
                  name: {{ include "orchestrator.secretName" . }}
                  key: TOPOLOGY_USER
            - name: ORC_TOPOLOGY_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: {{ include "orchestrator.secretName" . }}
                  key: TOPOLOGY_PASSWORD
          {{- if .Values.extraEnv }}
            {{- toYaml .Values.extraEnv | nindent 12 }}
          {{- end }}
          args:
            - --leader-election-namespace={{ .Release.Namespace }}
            - --orchestrator-uri={{ include "orchestrator.apiURL" . }}
            {{- with .Values.sidecar57 }}
            - --sidecar-image={{ .image.repository }}:{{ .image.tag | default $appVersion }}
            {{- end -}}
            {{- with .Values.sidecar80 }}
            - --sidecar-mysql8-image={{ .image.repository }}:{{ .image.tag | default $appVersion }}
            {{- end -}}
            {{- if .Values.watchNamespace }}
            - --namespace={{ .Values.watchNamespace }}
            {{- end }}
            {{- if .Values.gracefulShutdown.enabled }}
            - --failover-before-shutdown=true
            {{- else }}
            - --failover-before-shutdown=false
            {{- end }}
            {{- range $arg := .Values.extraArgs }}
            - {{ $arg }}
            {{- end }}
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8081
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8081
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
        - name: orchestrator
          securityContext:
            {{- toYaml .Values.orchestrator.securityContext | nindent 12 }}
          image: {{ .Values.orchestrator.image.repository }}:{{ .Values.orchestrator.image.tag | default .Chart.AppVersion }}
          imagePullPolicy: {{ .Values.orchestrator.image.pullPolicy }}
          ports:
            - containerPort: 3000
              name: http
              protocol: TCP
            - containerPort: 10008
              name: raft
              protocol: TCP
          env:
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          {{- if .Values.orchestrator.extraEnv }}
            {{- toYaml .Values.orchestrator.extraEnv | nindent 12 }}
          {{- end }}
          envFrom:
            - prefix: ORC_
              secretRef:
                name: {{ include "orchestrator.secretName" . }}
          volumeMounts:
            - name: data
              mountPath: /var/lib/orchestrator
            - name: config
              mountPath: /usr/local/share/orchestrator/templates
          livenessProbe:
            timeoutSeconds: 10
            initialDelaySeconds: 200
            httpGet:
              path: /api/lb-check
              port: 3000
          # https://github.com/github/orchestrator/blob/master/docs/raft.md#proxy-healthy-raft-nodes
          readinessProbe:
            timeoutSeconds: 10
            httpGet:
              path: /api/raft-health
              port: 3000
          resources:
            {{- toYaml .Values.orchestrator.resources | nindent 12 }}

      volumes:
        - name: config
          configMap:
            name: {{ template "orchestrator.fullname" . }}
        {{- if not .Values.orchestrator.persistence.enabled }}
        - name: data
          emptyDir: {}
        {{- end }}

      {{- if .Values.orchestrator.persistence.fsGroupWorkaroundEnabled }}
      initContainers:
        - name: init-mount
          securityContext:
            runAsUser: 0
          image: busybox:1.34.0
          command: ['sh', '-c', "chown -R {{ .Values.podSecurityContext.fsGroup | default "0" }}:{{ .Values.podSecurityContext.fsGroup | default "0" }} /var/lib/orchestrator"]
          volumeMounts:
            - name: data
              mountPath: /var/lib/orchestrator
      {{- end }}

      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}

  {{- if .Values.orchestrator.persistence.enabled }}
  volumeClaimTemplates:
    - metadata:
        name: data
        {{- with .Values.orchestrator.persistence.annotations }}
        annotations:
          {{- toYaml . | nindent 10 }}
        {{- end }}
      spec:
        accessModes: [ {{ .Values.orchestrator.persistence.accessMode }} ]
        resources:
          requests:
            storage: {{ .Values.orchestrator.persistence.size }}
        {{- if .Values.orchestrator.persistence.selector }}
        {{- with .Values.orchestrator.persistence.selector.matchLabels }}
        selector:
          matchLabels:
            {{- toYaml . | nindent 12 }}
        {{- end }}
        {{- end }}
      {{- if .Values.orchestrator.persistence.storageClass }}
      {{- if (eq "-" .Values.orchestrator.persistence.storageClass) }}
        storageClassName: ""
      {{- else }}
        storageClassName: "{{ .Values.orchestrator.persistence.storageClass }}"
      {{- end }}
      {{- end }}
  {{- end }}
```

## Storage

Allocate storage(GiB) to the database service based on the available storage within the Virtual Cluster for App deployment. 

## Version Update

You can make changes to the app profile services, such as version updates, manifest updates, app tier additions, and removals. [App Profile Service update](/devx/app-profile/versioning-app-profile#updateanappprofile)
will generate an update notification on all the apps created from the app profile. Update notifications include all the changes applied to the profile since the initial creation or the previous update. You can apply the update to the Apps individually at any time.

## Output Variables

Each Database service has a set of output variables. These output variables are used to establish Database connectivity with other service layers of the app profile.

**Note:** The DB service connectivity follows a fixed hierarchy in Palette. The DB connectivity is established for higher-level services using the output variable. Higher-level refers to the service added to the app profile after adding the DB service. 

<br />

