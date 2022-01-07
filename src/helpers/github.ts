import axios from "axios";

export const extractHandleFromGitHubUrl = (url: string): string => {
  const urlArray: string[] = url?.split("/");
  return urlArray[urlArray.length - 1];
};

export const getRepos = async (url: string): Promise<any> => {
  return await axios.get(url);
}
