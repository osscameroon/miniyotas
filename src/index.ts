import express from "express";
import exphbs from "express-handlebars";
import * as helpers from "./helpers/handlebars";
import { getValues, Record } from "./googlesheet";
import {getShop, Item, Shop} from "./shop";
import Fuse from "fuse.js";

enum E_ENVIRONMENT {
  dev = "dev",
  stage = "stage",
  prod = "production",
}

const port: number = 3000;
const app = express();

const getCurrentYear = () => {
  const d = new Date();
  return d.getFullYear();
}

//Set view path
app.set("views", __dirname + "/views");
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
    helpers: helpers,
  })
);
app.set("view engine", ".hbs");

const getRecordsMatchingQuery = (query: string, records: Record[]): Record[] => {
  if (query === "") {
    return records;
  }

  const f: Fuse<Record> = new Fuse(records, {
    distance: 100,
    threshold: 0.3,
    keys: ["github_handle", "grade"],
  });
  return f.search(query)?.map((e: Fuse.FuseResult<Record>): Record => {
    return e.item;
  });
};

const handleContributors = async (req: any, res: any) => {
  const query = req.query.query || "";
  let records: Record[] = await getValues();

  records = getRecordsMatchingQuery(query, records);

  res.render("index", {
    records,
    link: "contributors",
    query,
    currentYear: getCurrentYear(),
  });
};

app.get("/", handleContributors);
app.get("/contributors", handleContributors);
app.get("/shop", async (req: any, res: any) => {
  const shop: Shop = getShop();
  const items: Item[] | undefined = shop?.items;

  console.log("items: ", items);

  res.render("index", {
    items,
    link: "shop",
    currentYear: getCurrentYear(),
  });
});
app.use('/views', express.static(__dirname + "/views"))
app.use('/res', express.static(__dirname + "/res"))

app.listen(port, () => {
  console.log(`The application is listening on port ${port}`);
});
