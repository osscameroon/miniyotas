#!/bin/sh

#get_org_repos print out organisation list of repositories
#param: organisation name
get_org_repos() {
	org=$1
	curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json"  https://api.github.com/orgs/$org/repos 2>/dev/null | jq '.[].url' -r
}

#get_repository_pull_requests print out organisation list of repositories
# param: repository name
get_repository_pull_requests() {
	repo=$1
	page=$2
	curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json"  $repo/pulls\?state\=all\&per_page\=100\&page\=$page 2>/dev/null | jq '.[] | {pull_request: .url, user: .user.login}'
}

#get_repository_issues print out organisation list of repositories
# param: repository name
get_repository_issues() {
	repo=$1
	page=$2
	curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json"  $repo/issues\?state\=all\&per_page\=100\&page\=$page 2>/dev/null | jq '.[] | {issue: .url, user: .user.login}'
}

ORG=osscameroon
REPOSITORIES=$(get_org_repos $ORG)

#get repositories pull requests
for repo in $REPOSITORIES; do
# 	echo "Getting pull request for repository: $repo"

	page=1
	while true; do
# 		echo "page: $page"
		ret=$(get_repository_pull_requests $repo $page)
		echo "$ret"
		if [[ -z "$ret" ]]; then
			break
		fi
		((page++))

		#sleep to not break the GitHub api limit
		sleep 1
	done

	#sleep to not break the GitHub api limit
	sleep 1
done


#get repositories issues
for repo in $REPOSITORIES; do
# 	echo "Getting issues for repository: $repo"

	page=1
	while true; do
# 		echo "page: $page"
		ret=$(get_repository_issues $repo $page)
		echo "$ret"
		if [[ -z "$ret" ]]; then
			break
		fi
		((page++))

		#sleep to not break the GitHub api limit
		sleep 1
	done

	#sleep to not break the GitHub api limit
	sleep 1
done
