#!/bin/bash
########################################
# Presubmit script triggered by Prow.  #
########################################

set -x
source prow/functions.sh

commenter
build_docs
