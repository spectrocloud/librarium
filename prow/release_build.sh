#!/bin/bash
########################################
# Postsubmit script triggered by Prow. #
########################################

set -x
set -e
set -u

source prow/functions.sh

build_release_docs
sync_s3
