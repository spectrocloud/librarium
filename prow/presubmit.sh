#!/bin/bash
########################################
# Presubmit script triggered by Prow.  #
########################################

set -x
set -e
set -u
source prow/functions.sh

check_docs
build_docs

