#!/bin/bash

set -e

./get_opened_issues.sh > opened_issues.json
cat opened_issues.json | jq -s '. | flatten'
