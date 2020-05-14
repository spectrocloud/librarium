#!/bin/bash
########################################
# Presubmit script triggered by Prow.  #
########################################

set -x
source prow/functions.sh
build_docs
