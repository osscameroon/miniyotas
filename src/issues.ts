import {getRepos} from "./helpers/github";

export interface Repo {
    title?: string,
    description?: string,
    language?: string,
    issues?: number
}

const formatRepos = (items: Repo[]): Repo[] => {
    return items?.sort((a, b) => {
        return Number(b?.issues) - Number(a?.issues);
    }).filter((a) => Number(a?.issues) > 0);
}

export const getProjects = async (): Promise<Repo[]> => {
    try {
        const response = await getRepos("https://api.github.com/orgs/osscameroon/repos");
        const repos: Repo[] = response.data.map((repository: { name: string; description: string; language: string; open_issues: string }) => {
            return {
                title: repository.name,
                description: repository.description,
                language: repository.language,
                issues: repository.open_issues
            };
        })

        return formatRepos(repos);
    } catch (error) {
        console.error("Failed to get project", error)
    }

    return [];
}
