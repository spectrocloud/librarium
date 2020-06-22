#!/bin/bash
########################################
# Postsubmit script triggered by Prow. #
########################################

set -x
set -e

source prow/functions.sh

build_docs
sync_s3

exit 0
