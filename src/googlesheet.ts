import { GoogleSpreadsheet } from "google-spreadsheet";
import fs from "fs";

const serviceAccount = ".secrets/service-account.json";
const spreadsheetID = "1T3eiwqCds2kvBsC2L4vh2kEE8zCa3ZaNHzB30spRHpw";

const getCreds = (): string => {
  let data: string = "";

  try {
    data = fs.readFileSync(serviceAccount, "utf8");
  } catch (err) {
    console.error("failed to load service account: ", err);
  }

  return data;
};

export interface IRecord {
  github_account: string;
  github_handle: string;
  yotas: number;
}

const extractHandleFromGitHubUrl = (url: string): string => {
  const urlArray: string[] = url?.split("/");
  return urlArray[urlArray.length - 1];
};

export const getValues = async (): Promise<IRecord[]> => {
  const creds = JSON.parse(getCreds());

  const doc = new GoogleSpreadsheet(spreadsheetID);
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const records: IRecord[] = rows
    .map((e: any): IRecord => {
      return {
        github_account: e.github_account,
        yotas: e.yotas || 0,
        github_handle: extractHandleFromGitHubUrl(e.github_account),
      };
    })
    .sort((a: IRecord, b: IRecord): number =>
      a.github_handle.toLowerCase() > b.github_handle.toLowerCase() ? 1 : -1
    );
  return records;
};
