#!/bin/bash
echo -e "\e[93mProduction\e[0m is on Git commit:"
cd ~/public_html
git show --oneline -s
git status
echo
echo -e "\e[93mStaging\e[0m is on Git commit:"
cd ~/public_html/sub/stg
git show --oneline -s
git status
