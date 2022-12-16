import { GoogleSpreadsheet } from "google-spreadsheet";
import { extractHandleFromGitHubUrl } from "./helpers/github";

const spreadsheetID = "1T3eiwqCds2kvBsC2L4vh2kEE8zCa3ZaNHzB30spRHpw";
const serviceAccountConfig = process.env.SERVICE_ACCOUNT_CONFIG;

export type Record = {
  github_account: string;
  github_handle: string;
  yotas: number;
  grade: string;
}

const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export const getFixtureValues = (): Record[] => {
  const grades =  ["member", "admin", "sponsor"];
  const handles = ["elhmn", "Sanix-Darker", "osscameroon"];

  const records: Record[] = Array.from(Array(100).keys()).map((): Record => {
    const handle = handles[getRandomIntInclusive(0, handles.length - 1)]
      return {
        github_account: `https://github.com/${handle}`,
        yotas: getRandomIntInclusive(0, 500),
        github_handle: handle,
        grade: grades[getRandomIntInclusive(0, grades.length - 1)],
      };
  }
  );

  return records;
}

export const getValues = async (): Promise<Record[]> => {
  if (process.env.NODE_ENV !== "production") {
       return getFixtureValues()
  }

  if (!serviceAccountConfig) {
    throw new Error("The service account credentials not found!");
  }

  const creds = JSON.parse(serviceAccountConfig);

  const doc = new GoogleSpreadsheet(spreadsheetID);
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const records: Record[] = rows
    .map((e: any): Record => {
      return {
        github_account: e.github_account,
        yotas: e.yotas || 0,
        github_handle: extractHandleFromGitHubUrl(e.github_account),
        grade: e.grade,
      };
    })
    .sort((a: Record, b: Record): number =>
      a.github_handle.toLowerCase() > b.github_handle.toLowerCase() ? 1 : -1
    );
  return records;
};
