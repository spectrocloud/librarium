---
sidebar_label: "Enterprise Install"
title: "Enterprise Install"
description: "Troubleshooting steps for errors encountered when installing an Enterprise Cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["troubleshooting", "self-hosted", "palette", "vertex"]
---

Refer to the following sections to troubleshoot errors encountered when installing an Enterprise Cluster.

## Scenario - MongoDB Replica Pods Crash during Palette Upgrade

When upgrading a self-hosted Palette instance from 4.8.35 to 4.8.37, the MongoDB replica pods may crash with a
`CrashLoopBackOff` error and the upgrade may be stuck. This issue may happen due to MongoDB replication lag or split
brain.

### Debug Steps

Use the following troubleshooting steps to check your Palette installation.

#### Replication Lag

Follow the steps outlined in the
[Check the Replication Lag](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#check-the-replication-lag)
guide.

#### Split Brain

1. Ensure that you have `kubectl` and `jq` installed on your local machine.

2. Log in to your self-hosted Palette instance System Console.

3. In the left main menu, click **Enterprise Cluster**.

4. In the cluster details page, scroll down to the **Kubernetes Config File** field and download the kubeconfig file.

5. Execute the following script to gather data and check for split brain.

   ```shell

   #!/usr/bin/env bash
   # =============================================================================
   # mongo-diagnose.sh — MongoDB Replica Set health checker for Palette/Vertex
   #
   # Usage:
   #   ./mongo-diagnose.sh --kubeconfig /path/to/kubeconfig.conf
   #   ./mongo-diagnose.sh                            # uses current KUBECONFIG / context
   #   ./mongo-diagnose.sh --platform palette         # force no-TLS mode
   #   ./mongo-diagnose.sh --platform vertex          # force TLS mode
   #   ./mongo-diagnose.sh -k /path/to/cfg -n hubble-system
   #
   # Platform detection (auto if --platform not given):
   #   vertex  — MongoDB uses mTLS (secret 'mongo-tls' present in namespace)
   #   palette — MongoDB uses no TLS (plain auth only)
   #
   # What it checks:
   #   1. MongoDB pod statuses (CrashLoopBackOff, restarts, readiness)
   #   2. Replica set status (primary, member health, optime lag)
   #   3. Oplog divergence detection (fassert 51121 — rolling-update collision)
   #   4. PVC state (Bound / Terminating / Pending)
   #   5. PodDisruptionBudget health
   #   6. Downstream Init-blocked pods
   #
   # Exit codes:  0 = healthy | 1 = degraded | 2 = critical
   #
   # Requirements: kubectl, jq (brew install jq)
   # =============================================================================

   set -uo pipefail

   # ── colours ───────────────────────────────────────────────────────────────────
   RED='\033[0;31m'; YEL='\033[1;33m'; GRN='\033[0;32m'
   CYN='\033[0;36m'; BOLD='\033[1m'; RST='\033[0m'

   ok()   { echo -e "${GRN}  ✔  ${1}${RST}"; }
   warn() { echo -e "${YEL}  ⚠  ${1}${RST}"; }
   fail() { echo -e "${RED}  ✘  ${1}${RST}"; }
   info() { echo -e "${CYN}  ➜  ${1}${RST}"; }
   hdr()  { echo -e "\n${BOLD}${1}${RST}"; printf '  '; printf '─%.0s' {1..62}; echo; }

   NAMESPACE="hubble-system"
   PLATFORM=""      # auto-detect if empty; or "palette" | "vertex"
   EXIT_CODE=0

   # ── args ──────────────────────────────────────────────────────────────────────
   while [[ $# -gt 0 ]]; do
   case "$1" in
      --kubeconfig|-k) export KUBECONFIG="$2"; shift 2 ;;
      --namespace|-n)  NAMESPACE="$2";          shift 2 ;;
      --platform|-p)
         PLATFORM="${2,,}"   # lowercase
         if [[ "$PLATFORM" != "palette" && "$PLATFORM" != "vertex" ]]; then
         echo -e "${RED}ERROR: --platform must be 'palette' or 'vertex'${RST}"
         exit 1
         fi
         shift 2 ;;
      --help|-h)
         sed -n '2,/^# ===/p' "$0" | grep '^#' | sed 's/^# \?//'
         exit 0 ;;
      *) echo "Unknown arg: $1  (try --help)"; exit 1 ;;
   esac
   done

   KCL="kubectl -n ${NAMESPACE}"

   # ── check deps ────────────────────────────────────────────────────────────────
   for dep in kubectl jq; do
   if ! command -v "$dep" &>/dev/null; then
      echo -e "${RED}ERROR: '${dep}' not found in PATH. Install it and retry.${RST}"
      exit 2
   fi
   done

   # ── verify cluster connectivity (live API call, not cached cluster-info) ──────
   if ! kubectl get --raw /healthz &>/dev/null 2>&1; then
   echo -e "${RED}ERROR: Cannot reach the Kubernetes API server.${RST}"
   echo -e "${YEL}       Current context: $(kubectl config current-context 2>/dev/null || echo '(unknown)')${RST}"
   echo -e "${YEL}       Tip: run with --kubeconfig /path/to/your.conf${RST}"
   echo -e "${YEL}       e.g. ./mongo-diagnose.sh -k ~/Downloads/mykubeconfig.conf${RST}"
   exit 2
   fi

   # ── platform auto-detection ───────────────────────────────────────────────────
   if [[ -z "$PLATFORM" ]]; then
   if $KCL get secret mongo-tls &>/dev/null; then
      PLATFORM="vertex"
   else
      PLATFORM="palette"
   fi
   PLATFORM_SRC="(auto-detected)"
   else
   PLATFORM_SRC="(explicit)"
   fi

   echo -e "\n${BOLD}╔══════════════════════════════════════════════════════════════╗${RST}"
   echo -e "${BOLD}║       MongoDB Replica Set Diagnostic — Palette/Vertex        ║${RST}"
   echo -e "${BOLD}╚══════════════════════════════════════════════════════════════╝${RST}"
   echo -e "  Namespace : ${CYN}${NAMESPACE}${RST}"
   echo -e "  Platform  : ${CYN}${PLATFORM} ${PLATFORM_SRC}${RST}"
   echo -e "  TLS mode  : ${CYN}$([ "$PLATFORM" = "vertex" ] && echo "enabled (mTLS)" || echo "disabled (plain auth)")${RST}"
   echo -e "  Kubeconfig: ${CYN}${KUBECONFIG:-"(current context)"}${RST}"
   echo -e "  Timestamp : ${CYN}$(date -u +"%Y-%m-%dT%H:%M:%SZ")${RST}"

   # ── helper: get mongo pods ────────────────────────────────────────────────────
   get_mongo_pods() {
   $KCL get pods -l role=mongo --no-headers 2>/dev/null
   }

   # ── helper: run mongosh on a pod (TLS or plain based on platform) ─────────────
   run_mongosh() {
   local pod="$1" eval_str="$2"

   if [[ "$PLATFORM" == "vertex" ]]; then
      # Vertex: mTLS — combine cert+key, then connect with full TLS flags
      $KCL exec "$pod" -c mongo -- bash -c \
         "cat /var/mongodb/tls/tls.crt /var/mongodb/tls/tls.key > /tmp/mc.pem 2>/dev/null
         PASS=\$(printenv MONGODB_INITDB_ROOT_PASSWORD)
         mongosh --quiet --tls \
            --tlsCAFile /var/mongodb/tls/ca.crt \
            --tlsCertificateKeyFile /tmp/mc.pem \
            --tlsAllowInvalidCertificates \
            -u root -p \"\$PASS\" --authenticationDatabase admin \
            --eval '${eval_str}' 2>/dev/null" 2>/dev/null
   else
      # Palette: no TLS — env var is MONGO_INITDB_ROOT_PASSWORD, db arg style
      $KCL exec "$pod" -c mongo -- bash -c \
         "PASS=\$(printenv MONGO_INITDB_ROOT_PASSWORD)
         mongosh --quiet \
            -u root -p \"\$PASS\" admin \
            --eval '${eval_str}' 2>/dev/null" 2>/dev/null
   fi
   }

   # ══════════════════════════════════════════════════════════════════════════════
   # STEP 1 — Pod Status
   # ══════════════════════════════════════════════════════════════════════════════
   hdr "STEP 1 — MongoDB Pod Status"

   CRASH_PODS=()
   RUNNING_PODS=()

   while IFS= read -r line; do
   [[ -z "$line" ]] && continue
   NAME=$(echo "$line"     | awk '{print $1}')
   READY=$(echo "$line"    | awk '{print $2}')
   STATUS=$(echo "$line"   | awk '{print $3}')
   RESTARTS=$(echo "$line" | awk '{print $4}')
   AGE=$(echo "$line"      | awk '{print $5}')

   case "$STATUS" in
      Running)
         ok "$NAME  ready=$READY  restarts=$RESTARTS  age=$AGE"
         RUNNING_PODS+=("$NAME")
         ;;
      CrashLoopBackOff|Error|OOMKilled)
         fail "$NAME  ready=$READY  restarts=$RESTARTS  status=${STATUS}  age=$AGE"
         CRASH_PODS+=("$NAME")
         EXIT_CODE=2
         ;;
      Init:*|PodInitializing)
         warn "$NAME  ready=$READY  status=${STATUS}  age=$AGE  (still initializing)"
         [[ $EXIT_CODE -lt 1 ]] && EXIT_CODE=1
         ;;
      *)
         warn "$NAME  ready=$READY  status=${STATUS}  restarts=$RESTARTS  age=$AGE"
         [[ $EXIT_CODE -lt 1 ]] && EXIT_CODE=1
         ;;
   esac
   done < <(get_mongo_pods)

   if [[ ${#RUNNING_PODS[@]} -eq 0 && ${#CRASH_PODS[@]} -eq 0 ]]; then
   fail "No MongoDB pods found in namespace '${NAMESPACE}' with label role=mongo"
   echo -e "${YEL}  Verify the namespace: kubectl get pods -n ${NAMESPACE} -l role=mongo${RST}"
   EXIT_CODE=2
   fi

   # ── 1a. Crash log analysis ────────────────────────────────────────────────────
   if [[ ${#CRASH_PODS[@]} -gt 0 ]]; then
   hdr "STEP 1a — Crash Log Analysis"

   for POD in "${CRASH_PODS[@]}"; do
      info "Scanning crash logs: $POD"
      LOG=$($KCL logs "$POD" -c mongo --previous --tail=150 2>/dev/null || \
            $KCL logs "$POD" -c mongo --tail=150 2>/dev/null            || echo "")

      if echo "$LOG" | grep -q "51121\|Common point must be at least stable timestamp"; then
         fail "${POD} → fassert 51121 confirmed — oplog divergence (rolling-update primary collision)"
         COMMON=$(echo "$LOG" | grep -oE '"commonPoint":\{"t":[0-9]+,"i":[0-9]+\}' | head -1)
         STABLE=$(echo "$LOG" | grep -oE '"stableTimestamp":\{"t":[0-9]+,"i":[0-9]+\}' | head -1)
         [[ -n "$COMMON" ]] && info "  commonPoint    : $COMMON"
         [[ -n "$STABLE" ]] && info "  stableTimestamp: $STABLE"
         echo -e "  ${YEL}  Fix: delete PVC + pod to force resync from healthy primary${RST}"
      elif echo "$LOG" | grep -q "OplogStartMissing\|sync source.*diverged\|diverged"; then
         fail "${POD} → Oplog divergence (OplogStartMissing)"
      elif echo "$LOG" | grep -q "fassert\|FASSERT"; then
         FASSERT=$(echo "$LOG" | grep -m1 "fassert\|FASSERT" || true)
         fail "${POD} → Fatal assertion: ${FASSERT}"
      elif echo "$LOG" | grep -q "WiredTiger\|WT_ERROR"; then
         fail "${POD} → WiredTiger storage error — possible PVC corruption"
      elif [[ -z "$LOG" ]]; then
         warn "${POD} → No logs available (pod may not have started)"
      else
         warn "${POD} → Crashing — no known pattern matched. Last lines:"
         echo "$LOG" | tail -5 | sed 's/^/         /'
      fi
   done
   fi

   # ══════════════════════════════════════════════════════════════════════════════
   # STEP 2 — Replica Set Status
   # ══════════════════════════════════════════════════════════════════════════════
   hdr "STEP 2 — Replica Set Status"

   if [[ ${#RUNNING_PODS[@]} -eq 0 ]]; then
   fail "No running pod available to query rs.status()"
   EXIT_CODE=2
   else
   QUERY_POD="${RUNNING_PODS[0]}"
   info "Querying via ${QUERY_POD}"

   RS_RAW=$(run_mongosh "$QUERY_POD" \
      'var s=rs.status(); var o=s.optimes||{};
      JSON.stringify({
         set:s.set, ok:s.ok, myState:s.myState, term:s.term+"",
         lastCommittedT: (o.lastCommittedOpTime&&o.lastCommittedOpTime.ts)?o.lastCommittedOpTime.ts.t+"":"0",
         appliedT:       (o.appliedOpTime&&o.appliedOpTime.ts)?o.appliedOpTime.ts.t+"":"0",
         members:s.members.map(function(m){return{
            name:m.name.split(".")[0], state:m.stateStr, health:m.health,
            uptime:m.uptime, lastHBMsg:m.lastHeartbeatMessage||"",
            syncSrc:(m.syncSourceHost||"").split(".")[0],
            optimeT:m.optime&&m.optime.ts?m.optime.ts.t+"":"0"
         }})
      })' 2>/dev/null || echo "")

   if [[ -z "$RS_RAW" ]]; then
      fail "Could not retrieve rs.status() — auth failure or MongoDB not ready"
      EXIT_CODE=2
   else
      RS_SET=$(echo "$RS_RAW"  | jq -r '.set')
      RS_TERM=$(echo "$RS_RAW" | jq -r '.term')
      COMMITTED=$(echo "$RS_RAW" | jq -r '.lastCommittedT')
      APPLIED=$(echo "$RS_RAW"   | jq -r '.appliedT')
      LAG_SECS=$(( ${APPLIED:-0} - ${COMMITTED:-0} ))

      PRIMARY_COUNT=$(echo "$RS_RAW" | jq '[.members[] | select(.state=="PRIMARY")] | length')
      HEALTHY_COUNT=$(echo "$RS_RAW" | jq '[.members[] | select(.health==1)] | length')
      TOTAL_COUNT=$(echo "$RS_RAW"   | jq '.members | length')

      info "ReplicaSet: ${RS_SET}  term=${RS_TERM}  members=${TOTAL_COUNT}  healthy=${HEALTHY_COUNT}"
      echo ""

      # print member table
      printf "  %-14s  %-12s  %9s  %s\n" "POD" "STATE" "UPTIME" "SYNC_SOURCE"
      printf "  %-14s  %-12s  %9s  %s\n" "--------------" "------------" "---------" "-----------"
      while IFS= read -r member; do
         M_NAME=$(echo "$member"   | jq -r '.name')
         M_STATE=$(echo "$member"  | jq -r '.state')
         M_HEALTH=$(echo "$member" | jq -r '.health')
         M_UP=$(echo "$member"     | jq -r '.uptime')
         M_SRC=$(echo "$member"    | jq -r '.syncSrc')
         M_HB=$(echo "$member"     | jq -r '.lastHBMsg')

         STATE_COL="$GRN"
         [[ "$M_STATE" != "PRIMARY" && "$M_STATE" != "SECONDARY" ]] && STATE_COL="$RED"
         HEALTH_COL="$GRN"; [[ "$M_HEALTH" != "1" ]] && HEALTH_COL="$RED"

         printf "  ${HEALTH_COL}%-14s${RST}  ${STATE_COL}%-12s${RST}  %9ss  ←%s\n" \
         "$M_NAME" "$M_STATE" "$M_UP" "${M_SRC:-—}"
         if [[ -n "$M_HB" && "$M_HB" != "null" ]]; then
         echo -e "  ${YEL}              hb: ${M_HB:0:90}${RST}"
         fi
      done < <(echo "$RS_RAW" | jq -c '.members[]')

      echo ""

      # primary check
      if [[ "$PRIMARY_COUNT" -eq 0 ]]; then
         fail "NO PRIMARY elected — replica set cannot accept writes"
         EXIT_CODE=2
      elif [[ "$PRIMARY_COUNT" -eq 1 ]]; then
         ok "Primary elected (term ${RS_TERM})"
      else
         fail "Multiple primaries detected (${PRIMARY_COUNT}) — split-brain!"
         EXIT_CODE=2
      fi

      # healthy member count
      if [[ "$HEALTHY_COUNT" -lt 2 ]]; then
         fail "Only ${HEALTHY_COUNT}/${TOTAL_COUNT} members healthy — below majority, writes blocked"
         EXIT_CODE=2
      elif [[ "$HEALTHY_COUNT" -lt "$TOTAL_COUNT" ]]; then
         warn "${HEALTHY_COUNT}/${TOTAL_COUNT} members healthy — degraded but majority maintained"
         [[ $EXIT_CODE -lt 1 ]] && EXIT_CODE=1
      else
         ok "All ${TOTAL_COUNT}/${TOTAL_COUNT} members healthy"
      fi

      # uncommitted oplog lag (sign of a long-solo-primary run)
      if [[ $LAG_SECS -gt 300 ]]; then
         warn "Uncommitted oplog lag: ${LAG_SECS}s — primary has writes not yet majority-acknowledged"
         [[ $EXIT_CODE -lt 1 ]] && EXIT_CODE=1
      elif [[ $LAG_SECS -gt 0 ]]; then
         info "Minor uncommitted lag: ${LAG_SECS}s (normal during catch-up)"
      else
         ok "lastCommittedOpTime == appliedOpTime — no uncommitted lag"
      fi
   fi
   fi

   # ══════════════════════════════════════════════════════════════════════════════
   # STEP 3 — PVC Status
   # ══════════════════════════════════════════════════════════════════════════════
   hdr "STEP 3 — PersistentVolumeClaim Status"

   PVC_LINES=$($KCL get pvc -l role=mongo --no-headers 2>/dev/null)

   if [[ -z "$PVC_LINES" ]]; then
   warn "No MongoDB PVCs found"
   else
   while IFS= read -r line; do
      [[ -z "$line" ]] && continue
      PVC_NAME=$(echo "$line"   | awk '{print $1}')
      PVC_STATUS=$(echo "$line" | awk '{print $2}')
      PVC_SIZE=$(echo "$line"   | awk '{print $4}')
      PVC_AGE=$(echo "$line"    | awk '{print $NF}')

      case "$PVC_STATUS" in
         Bound)       ok   "${PVC_NAME}  status=Bound  size=${PVC_SIZE}  age=${PVC_AGE}" ;;
         Terminating) warn "${PVC_NAME}  status=Terminating — pod still holds PV (will clear on pod delete)"
                     [[ $EXIT_CODE -lt 1 ]] && EXIT_CODE=1 ;;
         Pending)     fail "${PVC_NAME}  status=Pending — storage provisioner may be stuck"
                     EXIT_CODE=2 ;;
         *)           warn "${PVC_NAME}  status=${PVC_STATUS}" ;;
      esac
   done < <(echo "$PVC_LINES")
   fi

   # ══════════════════════════════════════════════════════════════════════════════
   # STEP 4 — PodDisruptionBudget
   # ══════════════════════════════════════════════════════════════════════════════
   hdr "STEP 4 — PodDisruptionBudget"

   # Try common PDB names
   PDB_JSON=""
   for pdb_name in mongo-pdb mongodb-pdb mongo; do
   PDB_JSON=$($KCL get pdb "$pdb_name" -o json 2>/dev/null || echo "")
   [[ -n "$PDB_JSON" ]] && break
   done

   if [[ -z "$PDB_JSON" ]]; then
   warn "No MongoDB PDB found (tried: mongo-pdb, mongodb-pdb, mongo)"
   else
   CURR=$(echo "$PDB_JSON"    | jq '.status.currentHealthy')
   DESIRED=$(echo "$PDB_JSON" | jq '.status.desiredHealthy')
   ALLOWED=$(echo "$PDB_JSON" | jq '.status.disruptionsAllowed')
   MAX_UNA=$(echo "$PDB_JSON" | jq -r '.spec.maxUnavailable // "N/A"')
   PDB_NAME=$(echo "$PDB_JSON" | jq -r '.metadata.name')

   info "PDB '${PDB_NAME}': maxUnavailable=${MAX_UNA}  desiredHealthy=${DESIRED}"
   if [[ "$CURR" -ge "$DESIRED" ]]; then
      ok "${CURR}/${DESIRED} pods healthy — ${ALLOWED} disruption(s) currently allowed"
   else
      warn "${CURR}/${DESIRED} healthy — disruptionsAllowed=${ALLOWED} (rolling updates will stall)"
      [[ $EXIT_CODE -lt 1 ]] && EXIT_CODE=1
   fi
   fi

   # ══════════════════════════════════════════════════════════════════════════════
   # STEP 5 — Downstream Init-blocked or Crashed Services
   # ══════════════════════════════════════════════════════════════════════════════
   hdr "STEP 5 — Downstream Services"

   INIT_LINES=$($KCL get pods --no-headers 2>/dev/null \
   | grep -v "^mongo" \
   | grep -E "Init:|PodInitializing|CrashLoopBackOff" || true)

   INIT_COUNT=$(echo "$INIT_LINES" | grep -c . || true)

   if [[ "$INIT_COUNT" -gt 0 ]]; then
   warn "${INIT_COUNT} non-MongoDB pod(s) still blocked (Init / CrashLoop):"
   echo "$INIT_LINES" | awk '{printf "    %-50s  %s\n", $1, $3}'
   [[ $EXIT_CODE -lt 1 ]] && EXIT_CODE=1
   else
   ok "All downstream services are running"
   fi

   # ══════════════════════════════════════════════════════════════════════════════
   # FINAL VERDICT
   # ══════════════════════════════════════════════════════════════════════════════
   hdr "DIAGNOSIS SUMMARY"

   case $EXIT_CODE in
   0)
      echo -e "${GRN}${BOLD}  ✔  HEALTHY — MongoDB RS is fully operational${RST}"
      ;;
   1)
      echo -e "${YEL}${BOLD}  ⚠  DEGRADED — RS operational but has warnings${RST}"
      echo -e "${YEL}      Review warnings above. No immediate data risk.${RST}"
      ;;
   2)
      echo -e "${RED}${BOLD}  ✘  CRITICAL — MongoDB RS requires immediate action${RST}"
      echo ""
      if [[ ${#CRASH_PODS[@]} -gt 0 ]]; then
         echo -e "${YEL}  Likely cause : Oplog divergence (rolling-update primary collision)${RST}"
         echo -e "${YEL}  Recommended fix (wipes crashed nodes and resyncs from healthy primary):${RST}"
         echo ""
         for POD in "${CRASH_PODS[@]}"; do
         echo -e "    ${CYN}kubectl delete pvc mongo-data-${POD} -n ${NAMESPACE}${RST}"
         done
         for POD in "${CRASH_PODS[@]}"; do
         echo -e "    ${CYN}kubectl delete pod ${POD} -n ${NAMESPACE}${RST}"
         done
         echo ""
         echo -e "  ${RED}⚠  Verify the healthy primary holds all committed data before running.${RST}"
      fi
      ;;
   esac

   echo ""
   exit $EXIT_CODE

   ```

   ```shell "Example Output"
   STEP 1 — MongoDB Pod Status
   ✘  mongo-0  ready=0/1  restarts=12  status=CrashLoopBackOff  age=1h
   ✔  mongo-1  ready=1/1   restarts=0  age=10d
   ✔  mongo-2  ready=1/1   restarts=0  age=10d

   STEP 1a — Crash Log Analysis
   ➜ Scanning crash logs: mongo-0
   ✘ mongo-0 → fassert 51121 confirmed — oplog divergence (rolling-update primary collision)
      commonPoint    : "commonPoint":{"t":1681234567,"i":1}
      stableTimestamp: "stableTimestamp":{"t":1681230000,"i":1}
      Fix: delete PVC + pod to force resync from healthy primary

   STEP 2 — Replica Set Status
   ➜ Querying via mongo-1

   ReplicaSet: rs0  term=4  members=3  healthy=2

   POD              STATE         UPTIME      SYNC_SOURCE
   --------------   ------------  ---------   -----------
   mongo-1          PRIMARY       900000s     ←—
   mongo-2          SECONDARY     890000s     ←mongo-1
   mongo-0          RECOVERING    0s          ←mongo-1
      hb: the sync source has diverged

   ✔  Primary elected (term 4)
   ✘  Only 2/3 members healthy — below majority, writes blocked   <-- (script may mark critical)
   ⚠  Uncommitted oplog lag: 3600s — primary has writes not yet majority-acknowledged

   STEP 3 — PersistentVolumeClaim Status
   ✔  mongo-pvc-mongo-1  status=Bound  size=20Gi  age=10d
   ✔  mongo-pvc-mongo-2  status=Bound  size=20Gi  age=10d
   ✔  mongo-pvc-mongo-0  status=Bound  size=20Gi  age=1h

   STEP 4 — PodDisruptionBudget
   ➜ PDB 'mongo': maxUnavailable=1  desiredHealthy=2
   ✔  2/2 pods healthy — 0 disruption(s) currently allowed

   STEP 5 — Downstream Services
   ✔  All downstream services are running

   DIAGNOSIS SUMMARY

   ✘  CRITICAL — MongoDB RS requires immediate action

   Likely cause : Oplog divergence (rolling-update primary collision)
   Recommended fix (wipes crashed nodes and resyncs from healthy primary):

      kubectl delete pvc mongo-data-mongo-0 -n hubble-system
      kubectl delete pod mongo-0 -n hubble-system

   ⚠  Verify the healthy primary holds all committed data before running.
   ```

6. Promote a healthy node to primary. Refer to
   [Force a Self-Managed Replica Set Member to Become Primary](https://www.mongodb.com/docs/manual/tutorial/force-member-to-be-primary/)
   for further guidance.

7. Delete persistent volume claims and the unhealthy pods.

   ```shell
   kubectl delete pvc <mongo-pod-pvc> -n hubble-system
   kubectl delete pod <mongo-pod> -n hubble-system
   ```

Palette recreates all resources with the correct configuration.

## Scenario - VerteX Management Appliance Fails to Upgrade due to Stuck LINSTOR Satellite Pods

When attempting to upgrade the VerteX Management Appliance, the `linstor-satellite.*` and `linstor-csi-node.*` pods may
become stuck, which causes the upgrade process to stall. This is because the `linstor-satellite.*` pods may be using an
incorrect [Distributed Replicated Block Device (DRBD)](https://linbit.com/drbd-user-guide/drbd-guide-9_0-en/) image for
the `drbd-module-loader` container.

To resolve this issue, you can check whether the pods are using an incorrect image and update them if necessary.

### Debug Steps

1. Log in to the Local UI of the leader node of your VerteX management cluster. By default, Local UI is accessible at
   `https://<node-ip>:5080`. Replace `<node-ip>` with the IP address of the leader node.

2. From the left main menu, click **Cluster**.

3. Under **Environment**, download the **Admin Kubeconfig File** by clicking on the `<cluster-name>.kubeconfig`
   hyperlink.

4. Open a terminal session in an environment that has network access to the VerteX management cluster.

5. Issue the following command to set the `KUBECONFIG` environment variable to the path of the kubeconfig file you
   downloaded in step 3.

   ```bash
   export KUBECONFIG=<path-to-kubeconfig-file>
   ```

6. Use the following command to check the status of these pods in the `piraeus-system` namespace.

   ```bash
   kubectl get pods --namespace piraeus-system
   ```

   In the output, look for the status of the `linstor-satellite.*` pods.

   ```shell hideClipboard title="Example output"
   NAME                                                            READY   STATUS                  RESTARTS         AGE
   ha-controller-2886l                                             1/1     Running                 0                25h
   ha-controller-nnvqt                                             1/1     Running                 1 (29m ago)      25h
   ha-controller-qhc26                                             1/1     Running                 1 (36m ago)      25h
   linstor-controller-69b8ff6479-ccpzx                             1/1     Running                 0                31m
   linstor-csi-controller-78c8bc4d55-5gk2b                         7/7     Running                 4 (28m ago)      38m
   linstor-csi-node-dp8lm                                          0/3     Error                   0                25h
   linstor-csi-node-r2hfv                                          0/3     Error                   0                25h
   linstor-csi-node-tpt6h                                          3/3     Running                 0                25h
   linstor-satellite.edge-1d3f3842cb0fdcef14b65cb510b5974f-5vkml   2/2     Running                 0                25h
   linstor-satellite.edge-53583842350d90345a1f7251033cb228-8s7js   0/2     Init:CrashLoopBackOff   10 (2m54s ago)   26m
   linstor-satellite.edge-c0913842383ebd183d13d1458bb762c5-78q97   0/2     Init:CrashLoopBackOff   11 (3m46s ago)   33m
   piraeusoperator-piraeus-controller-manager-6f8988d598-b2v57     1/1     Running                 1 (28m ago)      25h
   ```

7. If any of the `linstor-satellite.*` pods are not in a **Running** state, use the following command to describe the
   pods. Replace `<pod-name>` with the name of the LINSTOR satellite pod you want to inspect.

   ```bash
   kubectl describe pod <pod-name> --namespace piraeus-system
   ```

   Look for events indicating that the pod is attempting to use the `drbd9-jammy:v9.2.13` image for the
   `drbd-module-loader` container, such as the following example.

   ```shell hideClipboard title="Example output" {7,10}
   ...
   Events:
     Type     Reason     Age                   From               Message
     ----     ------     ----                  ----               -------
     Normal   Scheduled  34m                   default-scheduler  Successfully assigned piraeus-system/linstor-satellite.edge-c0913842383ebd183d13d1458bb762c5-78q97 to edge-c0913842383ebd183d13d1458bb762c5
     Warning  BackOff    26m (x6 over 31m)     kubelet            Back-off restarting failed container drbd-module-loader in pod linstor-satellite.edge-c0913842383ebd183d13d1458bb762c5-78q97_piraeus-system(71ea7db5-cc2c-4585-b1f7-fcc19bf14891)
     Normal   Pulled     26m (x5 over 34m)     kubelet            Container image "us-docker.pkg.dev/palette-images-fips/packs/piraeus-operator/2.8.1/drbd9-jammy:v9.2.13" already present on machine
     Normal   Created    26m (x5 over 34m)     kubelet            Created container: drbd-module-loader
     Normal   Started    26m (x5 over 34m)     kubelet            Started container drbd-module-loader
     Normal   Pulled     5m58s (x7 over 25m)   kubelet            Container image "us-docker.pkg.dev/palette-images-fips/packs/piraeus-operator/2.8.1/drbd9-jammy:v9.2.13" already present on machine
     Normal   Created    5m58s (x7 over 25m)   kubelet            Created container: drbd-module-loader
     Normal   Started    5m58s (x7 over 25m)   kubelet            Started container drbd-module-loader
     Warning  BackOff    3m41s (x53 over 23m)  kubelet            Back-off restarting failed container drbd-module-loader in pod linstor-satellite.edge-c0913842383ebd183d13d1458bb762c5-78q97_piraeus-system(71ea7db5-cc2c-4585-b1f7-fcc19bf14891)
   ```

8. If any of the `linstor-satellite.*` pods are using the `drbd9-jammy:v9.2.13` image, issue the following command to
   create a manifest that corrects the image reference for the `drbd-module-loader` container.

   ```bash
   kubectl apply --filename - <<EOF
   apiVersion: piraeus.io/v1
   kind: LinstorSatelliteConfiguration
   metadata:
     name: custom-loader-image
     namespace: piraeus-system
   spec:
     podTemplate:
       spec:
         initContainers:
           - name: drbd-module-loader
             image: us-docker.pkg.dev/palette-images-fips/packs/piraeus-operator/2.8.1/dbrd-loader:v2.8.1
             imagePullPolicy: IfNotPresent
   EOF
   ```

   ```shell hideClipboard title="Expected output"
   linstorsatelliteconfiguration.piraeus.io/custom-loader-image created
   ```

9. Wait for the `linstor-satellite.*` pods to be recreated with the new image.

10. Verify that the `drbd-module-loader` container is using the new image by describing the `linstor-satellite.*` pods.
    Replace `<pod-name>` with the name of the pod you want to check. You may need to issue
    `kubectl get pods --namespace piraeus-system` first as the pod names will have changed.

    ```bash
    kubectl describe pods <pod-name> --namespace piraeus-system
    ```

    Look for events indicating that the `drbd-module-loader` container is now using the `dbrd-loader:v2.8.1` image.

    ```shell hideClipboard title="Example output" {6}
    ...
    Events:
     Type    Reason     Age    From               Message
     ----    ------     ----   ----               -------
     Normal  Scheduled  4m44s  default-scheduler  Successfully assigned piraeus-system/linstor-satellite.edge-c0913842383ebd183d13d1458bb762c5-wfd4q to edge-c0913842383ebd183d13d1458bb762c5
     Normal  Pulled     4m45s  kubelet            Container image "us-docker.pkg.dev/palette-images-fips/packs/piraeus-operator/2.8.1/dbrd-loader:v2.8.1" already present on machine
     Normal  Created    4m45s  kubelet            Created container: drbd-module-loader
     Normal  Started    4m44s  kubelet            Started container drbd-module-loader
    ```

The VerteX Management Appliance upgrade process will then continue. You can monitor the upgrade progress in Local UI.

## Scenario - Palette/VerteX Management Appliance Installation Stalled due to piraeus-operator Pack in Error State

During the installation of the [Palette](../enterprise-version/install-palette/palette-management-appliance.md) or
[VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md), the `piraeus-operator`
pack can enter an error state in Local UI. This can be caused by stalled creation of Kubernetes secrets in the
`piraeus-system` namespace and can prevent the installation from completing successfully.

To resolve, you can manually delete any secrets in the `piraeus-system` namespace that have a `pending-install` status
label. This will allow the `piraeus-operator` pack to complete its deployment and the Palette/VerteX Management
Appliance installation to proceed.

### Debug Steps

1. Log in to the Local UI of the leader node of your Palette/VerteX management cluster. By default, Local UI is
   accessible at `https://<node-ip>:5080`. Replace `<node-ip>` with the IP address of the leader node.

2. From the left main menu, click **Cluster**.

3. Download the **Admin Kubeconfig File** by clicking on the `<cluster-name>.kubeconfig` hyperlink.

4. Open a terminal session in an environment that has network access to the Palette/VerteX management cluster.

5. Issue the following command to set the `KUBECONFIG` environment variable to the path of the kubeconfig file you
   downloaded in step 3.

   ```bash
   export KUBECONFIG=<path-to-kubeconfig-file>
   ```

6. Use `kubectl` to list all secrets in the `piraeus-system` namespace.

   ```bash
   kubectl get secrets --namespace piraeus-system
   ```

   ```bash hideClipboard title="Example output"
   NAME                                                      TYPE                             DATA   AGE
   sh.helm.release.v1.piraeusoperator-linstor-gui.v1         helm.sh/release.v1               1      1h
   sh.helm.release.v1.piraeusoperator-linstor-gui.v2         helm.sh/release.v1               1      1h
   sh.helm.release.v1.piraeusoperator-piraeus-cluster.v1     helm.sh/release.v1               1      1h
   sh.helm.release.v1.piraeusoperator-piraeus-dashboard.v1   helm.sh/release.v1               1      1h
   sh.helm.release.v1.piraeusoperator-piraeus.v1             helm.sh/release.v1               1      1h
   sh.helm.release.v1.piraeusoperator-piraeus.v2             helm.sh/release.v1               1      1h
   ```

7. Use the following command to check each secret for a `pending-install` status label. Replace `<secret-name>` with the
   name of the secret you want to check.

   ```bash
   kubectl describe secrets <secret-name> --namespace piraeus-system
   ```

   ```shell hideClipboard title="Example output" {6}
   Name:         sh.helm.release.v1.piraeusoperator-piraeus-cluster.v1
   Namespace:    piraeus-system
   Labels:       modifiedAt=0123456789
                 name=piraeusoperator-piraeus-cluster
                 owner=helm
                 status=pending-install
                 version=1
   Annotations:  <none>

   Type:  helm.sh/release.v1

   Data
   ====
   release:  7156 bytes
   ```

   :::tip

   You can also try using the following command to filter for secrets with a `pending-install` status label.

   ```bash
   kubectl describe secrets --namespace piraeus-system --selector status=pending-install
   ```

   :::

8. If you find any secrets with this label, delete them using the following command. Replace `<secret-name>` with the
   name of the secret you want to delete.

   ```bash
   kubectl delete secrets <secret-name> --namespace piraeus-system
   ```

9. After deleting any secrets with a `pending-install` status label, wait for the `piraeus-operator` pack to enter a
   **Running** status in Local UI. The installation of Palette/VerteX Management Appliance should then proceed
   successfully.

## Scenario - Unexpected Logouts in Tenant Console After Palette/VerteX Management Appliance Installation

After installing self-hosted Palette/Palette VerteX using the
[Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) or
[VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md), you may experience
unexpected logouts when using the tenant console. This can be caused by a time skew on your Palette/VerteX management
cluster nodes, which leads to authentication issues.

To verify the system time, open a terminal session on each node in your Palette/VerteX management cluster and issue the
following command to check the system time.

```bash
timedatectl
```

An output similar to the following will be displayed. A time skew is indicated by the `Local time` and `Universal time`
values being different across the nodes.

<Tabs>

<TabItem value="node1" label="Example output from node 1">

```shell hideClipboard
               Local time: Fri 2025-07-11 09:41:42 UTC
           Universal time: Fri 2025-07-11 09:41:42 UTC
                 RTC time: Fri 2025-07-11 09:41:42
                Time zone: UTC (UTC, +0000)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
```

</TabItem>

<TabItem value="node2" label="Example output from node 2">

```shell hideClipboard
               Local time: Fri 2025-07-11 09:41:45 UTC
           Universal time: Fri 2025-07-11 09:41:45 UTC
                 RTC time: Fri 2025-07-11 09:41:45
                Time zone: UTC (UTC, +0000)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
```

</TabItem>

<TabItem value="node3" label="Example output from node 3">

```shell hideClipboard
               Local time: Fri 2025-07-11 09:41:49 UTC
           Universal time: Fri 2025-07-11 09:41:49 UTC
                 RTC time: Fri 2025-07-11 09:41:49
                Time zone: UTC (UTC, +0000)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
```

</TabItem>

</Tabs>

You may also notice errors in the `auth-*` pod logs in the `hubble-system` namespace similar to the following.

```bash title="Example command to extract logs from auth pod"
kubectl logs --namespace hubble-system auth-5f95c77cb-49jtv
```

```shell hideClipboard title="Example output"
auth-5f95c77cb-49jtv Jul  7 17:22:46.378 ERROR [hubble_token.go:426/hucontext.getClaimsFromToken] [Unable to parse the token 'abcd...1234' due to Token used before
issued]
auth-5f95c77cb-49jtv Jul  7 17:22:46.378 ERROR [auth_service.go:282/service.(*AuthService).Logout] [provided token 'xxxxx' is not valid Token used before issued]
```

This indicates that the system time on your Palette/VerteX management cluster nodes is not synchronized with a Network
Time Protocol (NTP) server. To resolve this issue, you can configure an NTP server in the Palette/VerteX management
cluster settings.

### Debug Steps

1. Log in to Local UI of the leader node of your Palette/VerteX management cluster.

2. On the left main menu, click **Cluster**.

3. Click **Actions** in the top-right corner and select **Cluster Settings** from the drop-down menu.

4. In the **Network Time Protocol (NTP) (Optional)** field, enter the NTP server that you want to use for your
   Palette/VerteX management cluster. For example, you can use `pool.ntp.org` or any other NTP server that is accessible
   from your Palette/VerteX management cluster nodes.

5. Click **Save Changes** to apply the changes.

## Scenario - IP Pool Exhausted During Airgapped Upgrade

When upgrading a self-hosted airgapped cluster to version 4.6.32, the IPAM controller may report an `Exhausted IP Pools`
error despite having available IP addresses. This is due to a race condition in CAPV version 1.12.0, which may lead to
an orphaned IP claim when its associated VMware vSphere machine is deleted during the control plane rollout. When this
occurs, the IP claim and IP address are not cleaned up, keeping the IP reserved and exhausting the IP pool. To complete
the upgrade, you must manually release the orphaned claim holding the IP address.

### Debug Steps

1. Open up a terminal session in an environment that has network access to the cluster. Refer to
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Issue the following command to list the IP addresses of the current nodes in the cluster.

   :::info

   The airgap support VM is not listed, only the nodes in the cluster.

   :::

   ```bash
   kubectl get nodes \
   --output jsonpath='{range .items[*]}{.status.addresses[?(@.type=="InternalIP")].address}{"\n"}{end}'
   ```

   ```bash hideClipboard title="Example output"
   10.10.227.13
   10.10.227.11
   10.10.227.14
   ```

3. List all IP claims in the `spectro-mgmt` namespace. The base `spectro-mgmt-cluster` claim belongs to the airgap
   support VM.

   ```bash
   kubectl get ipclaim --namespace spectro-mgmt
   ```

   ```bash hideClipboard title="Example output"
   NAMESPACE      NAME                                   AGE
   spectro-mgmt   spectro-mgmt-cluster                   29h
   spectro-mgmt   spectro-mgmt-cluster-cp-43978-dw858-0  14h
   spectro-mgmt   spectro-mgmt-cluster-cp-43978-p2bpg-0  29h
   spectro-mgmt   spectro-mgmt-cluster-cp-dt44d-0        14h
   spectro-mgmt   spectro-mgmt-cluster-cp-qx4vw-0        6m
   ```

4. Map each claim to its allocated IP.

   ```bash
   kubectl get ipclaim --namespace spectro-mgmt \
   --output jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.address.name}{"\n"}{end}'
   ```

   Compare the IP addresses of the nodes in the cluster to the IP addresses in the claim list, ignoring the
   `spectro-mgmt-cluster` claim of the airgap support VM. The IP that appears in the claim list that does not appear in
   the node list is the orphaned claim. In the below example, the orphaned claim is `spectro-mgmt-cluster-cp-qx4vw-0`,
   which is tied to the IP address 10.10.227.12 (`spectro-mgmt-cluster-cluster1-10-10-227-12`).

   ```bash hideClipboard title="Example output" {5}
   spectro-mgmt-cluster                   spectro-mgmt-cluster-cluster1-10-10-227-10
   spectro-mgmt-cluster-cp-43978-dw858-0  spectro-mgmt-cluster-cluster1-10-10-227-14
   spectro-mgmt-cluster-cp-43978-p2bpg-0  spectro-mgmt-cluster-cluster1-10-10-227-13
   spectro-mgmt-cluster-cp-dt44d-0        spectro-mgmt-cluster-cluster1-10-10-227-11
   spectro-mgmt-cluster-cp-qx4vw-0        spectro-mgmt-cluster-cluster1-10-10-227-12
   ```

5. Delete the orphaned claim.

   ```bash
   kubectl delete ipclaim --namespace spectro-mgmt <claim-name>
   ```

   ```bash hideClipboard title="Example command"
   kubectl delete ipclaim --namespace spectro-mgmt spectro-mgmt-cluster-cp-qx4vw-0
   ```

6. Re-run the upgrade. For guidance, refer to the applicable upgrade guide for your airgapped instance of
   [Palette](../enterprise-version/upgrade/upgrade-vmware/airgap.md) or
   [VerteX](../vertex/upgrade/upgrade-vmware/airgap.md).

## Scenario - Self-Linking Error

When installing an Enterprise Cluster, you may encounter an error stating that the enterprise cluster is unable to
self-link. Self-linking is the process of Palette or VerteX becoming aware of the Kubernetes cluster it is installed on.
This error may occur if the self-hosted pack registry specified in the installation is missing the Certificate Authority
(CA). This issue can be resolved by adding the CA to the pack registry.

### Debug Steps

1. Log in to the pack registry server that you specified in the Palette or VerteX installation.

2. Download the CA certificate from the pack registry server. Different OCI registries have different methods for
   downloading the CA certificate. For Harbor, check out the
   [Download the Harbor Certificate](https://goharbor.io/docs/1.10/working-with-projects/working-with-images/pulling-pushing-images/#download-the-harbor-certificate)
   guide.

3. Log in to the system console. Refer to
   [Access Palette system console](../enterprise-version/system-management/system-management.md#access-the-system-console)
   or [Access Vertex system console](../vertex/system-management/system-management.md#access-the-system-console) for
   additional guidance.

4. From the left navigation menu, select **Administration** and click on the **Pack Registries** tab.

5. Click on the **three-dot Menu** icon for the pack registry that you specified in the installation and select
   **Edit**.

6. Click on the **Upload file** button and upload the CA certificate that you downloaded in step 2.

7. Check the box **Insecure Skip TLS Verify** and click on **Confirm**.

![A pack registry configuration screen.](/troubleshooting_enterprise-install_pack-registry-tls.webp)

After a few moments, a system profile will be created and Palette or VerteX will be able to self-link successfully. If
you continue to encounter issues, contact our support team by emailing
[support@spectrocloud.com](mailto:support@spectrocloud.com) so that we can provide you with further guidance.

## Scenario - Enterprise Backup Stuck

In the scenario where an enterprise backup is stuck, a restart of the management pod may resolve the issue. Use the
following steps to restart the management pod.

### Debug Steps

1. Open up a terminal session in an environment that has network access to the Kubernetes cluster. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Identify the `mgmt` pod in the `hubble-system` namespace. Use the following command to list all pods in the
   `hubble-system` namespace and filter for the `mgmt` pod.

   ```shell
   kubectl get pods --namespace hubble-system | grep mgmt
   ```

   ```shell hideClipboard
   mgmt-f7f97f4fd-lds69                   1/1     Running   0             45m
   ```

3. Restart the `mgmt` pod by deleting it. Use the following command to delete the `mgmt` pod. Replace `<mgmt-pod-name>`
   with the actual name of the `mgmt` pod that you identified in step 2.

   ```shell
   kubectl delete pod <mgmt-pod-name> --namespace hubble-system
   ```

   ```shell hideClipboard
   pod "mgmt-f7f97f4fd-lds69" deleted
   ```

## Scenario - Non-Unique vSphere CNS Mapping

In Palette and VerteX releases 4.4.8 and earlier, Persistent Volume Claims (PVCs) metadata do not use a unique
identifier for self-hosted Palette clusters. This causes incorrect Cloud Native Storage (CNS) mappings in vSphere,
potentially leading to issues during node operations and upgrades.

This issue is resolved in Palette and VerteX releases starting with 4.4.14. However, upgrading to 4.4.14 will not
automatically resolve this issue. If you have self-hosted instances of Palette in your vSphere environment older than
4.4.14, you should execute the following utility script manually to make the CNS mapping unique for the associated PVC.

### Debug Steps

1. Ensure your machine has network access to your self-hosted Palette instance with `kubectl`. Alternatively, establish
   an SSH connection to a machine where you can access your self-hosted Palette instance with `kubectl`.

2. Log in to your self-hosted Palette instance System Console.

3. In the **Main Menu**, click **Enterprise Cluster**.

4. In the cluster details page, scroll down to the **Kubernetes Config File** field and download the kubeconfig file.

5. Issue the following command to download the utility script.

   ```bash
   curl --output csi-helper https://software.spectrocloud.com/tools/csi-helper/csi-helper
   ```

6. Adjust the permission of the script.

   ```bash
   chmod +x csi-helper
   ```

7. Issue the following command to execute the utility script. Replace the placeholder with the path to your kubeconfig
   file.

   ```bash
   ./csi-helper --kubeconfig=<PATH_TO_KUBECONFIG>
   ```

8. Issue the following command to verify that the script has updated the cluster ID.

   ```bash
   kubectl describe configmap vsphere-cloud-config --namespace=kube-system
   ```

   If the update is successful, the cluster ID in the ConfigMap will have a unique ID assigned instead of
   `spectro-mgmt/spectro-mgmt-cluster`.

   ```hideClipboard {12}
   Name:         vsphere-cloud-config
   Namespace:    kube-system
   Labels:       component=cloud-controller-manager
               vsphere-cpi-infra=config
   Annotations:  cluster.spectrocloud.com/last-applied-hash: 17721994478134573986

   Data
   ====
   vsphere.conf:
   ----
   [Global]
   cluster-id = "896d25b9-bfac-414f-bb6f-52fd469d3a6c/spectro-mgmt-cluster"

   [VirtualCenter "vcenter.spectrocloud.dev"]
   insecure-flag = "true"
   user = "example@vsphere.local"
   password = "************"

   [Labels]
   zone = "k8s-zone"
   region = "k8s-region"


   BinaryData
   ====

   Events:  <none>
   ```

## Scenario - "Too Many Open Files" in Cluster

When viewing logs for Enterprise or [Private Cloud Gateway](../clusters/pcg/pcg.md) clusters, you may encounter a "too
many open files" error, which prevents logs from tailing after a certain point. To resolve this issue, you must increase
the maximum number of file descriptors for each node on your cluster.

### Debug Steps

Repeat the following process for each node in your cluster.

1. Log in to a node in your cluster.

   ```bash
   ssh -i <key-name> <spectro@hostname>
   ```

2. Switch to `sudo` mode using the command that best fits your system and preferences.

   ```bash
   sudo --login
   ```

3. Increase the maximum number of file descriptors that the kernel can allocate system-wide.

   ```bash
   echo "fs.file-max = 1000000" > /etc/sysctl.d/99-maxfiles.conf
   ```

4. Apply the updated `sysctl` settings. The increased limit is returned.

   ```bash
   sysctl -p /etc/sysctl.d/99-maxfiles.conf
   ```

   ```bash hideClipboard
   fs.file-max = 1000000
   ```

5. Restart the `kubelet` and `containerd` services.

   ```bash
   systemctl restart kubelet containerd
   ```

6. Confirm that the change was applied.

   ```bash
   sysctl fs.file-max
   ```

   ```bash hideClipboard
   fs.file-max = 1000000
   ```

## Scenario - MAAS and VMware vSphere Clusters Fail Image Resolution in Non-Airgap Environments

In Palette or VerteX non-airgap installations with versions 4.2.13 to 4.5.22, MAAS and VMware vSphere clusters may fail
to provision due to image resolution errors. These environments have incorrectly configured default image endpoints. To
resolve this issue, you must manually set these endpoints.

### Debug Steps

1. Open a terminal with connectivity to your self-hosted environment.

2. Execute the following command to save the base URL of your Palette instance API to the `BASE_URL` environment value.
   Add your correct URL in place of `REPLACE_ME`.

   ```shell
   export BASE_URL="REPLACE ME"
   ```

3. Use the following command to log in to the Palette System API by using the `/v1/auth/syslogin` endpoint. Ensure you
   replace the credentials below with your system console credentials.

   ```bash
   curl --location '$BASE_URL/v1/auth/syslogin' \
   --header 'Content-Type: application/json' \
   --data '{
     "password": "**********",
     "username": "**********"
   }'
   ```

   The output displays the authorization token.

   ```json hideClipboard
   {
     "Authorization": "**********.",
     "IsPasswordReset": true
   }
   ```

4. Copy the authorization token to your clipboard and assign it to an environment variable. Replace the placeholder
   below with the value from the output.

   ```shell hideClipboard
   export TOKEN=**********
   ```

5. Execute the following command to set the MAAS image endpoint to `https://maasgoldenimage.s3.amazonaws.com`. Replace
   the `caCert` value below with the Certificate Authority (CA) certificate for your self-hosted environment.

   ```shell
   curl --request PUT '$BASE_URL/v1/system/config/maas/image' \
   --header 'Authorization: $TOKEN' \
   --header 'Content-Type: application/json' \
   --data '{
      "spec": {
         "imagesHostEndpoint": "https://maasgoldenimage.s3.amazonaws.com",
         "insecureSkipVerify": false,
         "caCert": "**********"
      }
   }'
   ```

6. Execute the following command to set the VMware vSphere image endpoint to
   `https://vmwaregoldenimage.s3.amazonaws.com`. Replace the `caCert` value below with the Certificate Authority (CA)
   certificate for your self-hosted environment.

   ```shell
   curl --request PUT '$BASE_URL/v1/system/config/vsphere/image' \
   --header 'Authorization: $TOKEN' \
   --header 'Content-Type: application/json' \
   --data '{
      "spec": {
         "imagesHostEndpoint": "https://vmwaregoldenimage.s3.amazonaws.com",
         "insecureSkipVerify": false,
         "caCert": "**********"
      }
   }'
   ```

MAAS and VMware vSphere clusters will now be successfully provisioned on your self-hosted Palette environment.
