import YAML from "yaml";
import { extractHandleFromGitHubUrl } from "./helpers/github";
import * as fs from "fs";

const shopFilePath = __dirname + "/res/shop.yaml";

export interface Item {
  title?: string;
  description?: string;
  price?: number;
  count?: number;
  available?: boolean;
  image?: string;

  //the github_handle field is used to display
  //an image of one of the mentors providing
  //developper support
  github_handle?: string;
};

export interface Shop {
  items?: Item[];
};

const formatItems = (shop :Shop): Item[] | undefined => {
  let items = shop?.items?.map((i: Item): Item => ({
      ...i,
      image: "/res/imgs/"+ i.image,
      github_handle: extractHandleFromGitHubUrl(i.github_handle ?? ""),
    }));

    items?.sort((a, b) => {
      return Number(b?.available) - Number(a?.available);
    });

    return items
}

export const getShop = (): Shop => {
  try {
    const file = fs.readFileSync(shopFilePath, "utf8");
    const shop = YAML.parse(file);
    return {
      items: formatItems(shop),
    };
  } catch (err) {
    //replace this with a proper log
    //and proper http error handling
    console.error("Failed to parse file:", err);
  }

  return {};
};
