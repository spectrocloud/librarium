#!/usr/bin/env bash

github_url=`git remote -v | awk '/fetch/{print $2}' | sed -Ee 's#(git@|git://)#https://#' -e 's@com:@com/@' -e 's%\.git$%%' | awk '/github/'`;
branch_name=`git symbolic-ref HEAD | cut -d"/" -f 3,4`;
pr_url=$github_url"/compare/master..."$branch_name
if [ "$(uname)" == "Darwin" ]; then
  open $pr_url;
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  xdg-open $pr_url;
fi
