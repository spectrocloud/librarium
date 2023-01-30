#!/bin/bash
########################################
# Presubmit script triggered by Prow.  #
########################################

set -x
set -e
set -u
source prow/functions.sh
echo "Presubmit script triggered by Prow."
build_docs
sync_s3
