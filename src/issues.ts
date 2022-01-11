import {get} from "./helpers/github";

export interface Repo {
    title?: string,
    description?: string,
    language?: string,
    issues?: number
}

export interface Issue {
    title?: string,
    labels?: Array<String>,
    description?: string,
    link?: string
}

const formatRepos = (items: Repo[]): Repo[] => {
    return items?.sort((a, b) => {
        return Number(b?.issues) - Number(a?.issues);
    }).filter((a) => Number(a?.issues) > 0);
}

const filterIssues = (items: Issue[]): Issue[] => {
    items?.sort((a, b) => {
        let y1 = a.labels?.filter((label) => label.toLowerCase().includes("yotas"))[0]?.split(" ")[0]
        let y2 = b.labels?.filter((label) => label.toLowerCase().includes("yotas"))[0]?.split(" ")[0]

        // if y1 or y2 is undefined or null give it a big number to put him in last
        return Number(y1 ? y1 : '2000') - Number(y2 ? y2 : '2000');
    })

    return items;
}

export const getProjects = async (): Promise<Repo[]> => {
    try {
        const response = await get("https://api.github.com/orgs/osscameroon/repos");
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

export const getIssues = async (repo: String): Promise<Issue[]> => {
    try {
        const response = await get(`https://api.github.com/repos/osscameroon/${repo}/issues`);
        const issues: Issue[] = response.data.map((issue: { title: string; body: string; labels: Array<any>; html_url: string }) => {
            return {
                title: issue.title,
                description: issue.body,
                labels: issue.labels.map((label) => label.name),
                link: issue.html_url
            };
        })

        return filterIssues(issues);
    } catch (error) {
        console.error("Failed to get issues", error)
    }

    return [];
}
