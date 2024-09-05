import YAML from "yaml";
import {extractHandleFromGitHubUrl} from "./helpers/github";

import * as fs from "fs";

const yotasFilePath = __dirname + "/res/yotas.yaml";

export type Record = {
  github_account: string;
  github_handle: string;
  yotas: number;
  grade: string;
};

export const getYotas = async (): Promise<Record[]> => {
  const file = fs.readFileSync(yotasFilePath, "utf8");
  const records: Record[] = YAML.parse(file);
  return records
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
};
