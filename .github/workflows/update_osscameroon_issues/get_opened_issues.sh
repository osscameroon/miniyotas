#!/bin/bash

set -e

#get_org_repos print out organisation list of repositories
#param: organisation name
get_org_repos() {
	org=$1
	curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json"  https://api.github.com/orgs/$org/repos 2>/dev/null | jq '.[].url' -r
}

#get_repository_issues print out organisation list of repositories
# param: repository name
get_repository_opened_issues() {
	repo=$1
	page=$2
	curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json"  $repo/issues\?state\=open\&per_page\=100\&page\=$page 2>/dev/null | jq 'map(select(.pull_request == null)) | map({issue: .html_url, title: .title, author: .user.login, labels: (if (.labels != null) then [.labels[].name] else null end) })'
}

ORG=osscameroon
REPOSITORIES=$(get_org_repos $ORG)

#get repositories issues
for repo in $REPOSITORIES; do
# 	echo "Getting issues for repository: $repo"

	page=1
	while true; do
# 		echo "page: $page"
# 		echo "repo: $repo"
		ret=$(get_repository_opened_issues $repo $page)
		if [[ -z "$ret" ]]; then
			break
		fi
		if [[ "$ret" = "[]" ]]; then
			break
		fi

		echo "$ret"
		((page++))

		#sleep to not break the GitHub api limit
		sleep 1
	done

	#sleep to not break the GitHub api limit
	sleep 1
done
