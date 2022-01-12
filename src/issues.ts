import * as fs from "fs";

const issuesFilePath = __dirname + "/res/osscameroon_issues.json";

export interface Issue {
    title?: string,
    labels?: Array<String>,
    author?: string,
    issue?: string
}

const filterIssues = (items: Issue[]): Issue[] => {
    items.sort((a, b) => {
        let y1 = a.labels?.filter((label) => label.toLowerCase().includes("yotas"))[0]?.split(" ")[0]
        let y2 = b.labels?.filter((label) => label.toLowerCase().includes("yotas"))[0]?.split(" ")[0]

        // if y1 or y2 is undefined or null give it a big number to put him in last
        return Number(y1 ?? '2000') - Number(y2 ?? '2000');
    })

    return items;
}

export const getIssues = async (): Promise<Issue[]> => {
    try {
        const file = fs.readFileSync(issuesFilePath, "utf8");
        const issues: Issue[] = JSON.parse(file);

        return filterIssues(issues);
    } catch (error) {
        console.error("Failed to get issues", error)
    }

    return [];
}
