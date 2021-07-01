#!/bin/sh

#get_org_repos print out organisation list of repositories
#param: organisation name
get_org_repos() {
	org=$1
	curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json"  https://api.github.com/orgs/$org/repos 2>/dev/null | jq '.[].url' -r
}

LABELS_PATH=./labels.txt
ORG=osscameroon
REPOSITORIES=$(get_org_repos $ORG)

#create labels for every repository
for repo in $REPOSITORIES; do
	while IFS= read -r line; do
		echo "l: $line"
		curl  -X POST $repo/labels -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" -d ''"$line"''
		#sleep to not break the GitHub api limit
		sleep 1
	done < $LABELS_PATH

	#sleep to not break the GitHub api limit
	sleep 1
done
