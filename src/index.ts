import express from "express";
import exphbs from "express-handlebars";
import * as helpers from "./helpers/handlebars";
import { getValues, Record } from "./googlesheet";
import {getShop, Item, Shop} from "./shop";
import Fuse from "fuse.js";
import {getIssues, getProjects, Issue, Repo} from "./issues";

const port: number = 3000;
const limit: number  = 12;
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

const paginate = (items: Item[],page: number) => {
  const count = items.length;
  const startIndex = (page - 1) * limit;
  const endIndex  = page * limit;
  items = items.slice(startIndex,endIndex);
  const interval = (Number(page) > 5 ? Number(page) - 4 : 1);
  return {count,items,interval};
};

const handleContributors = async (req: any, res: any) => {
  const query = req.query.query || "";
  let records: Record[] = await getValues();

  records = getRecordsMatchingQuery(query, records);
  const {count,items,interval} = paginate(records,parseInt(req.query.page) || 1);
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  res.render("index", {
    fullUrl,
    records: items,
    link: "contributors",
    query,
    currentYear: getCurrentYear(),
    count,
    interval,
    hasParams: fullUrl.includes('?'),
    current: parseInt(req.query.page) || 1,
    pages: Math.ceil(count/limit),
  });
};

app.get("/", handleContributors);
app.get("/contributors", handleContributors);
app.get("/v1/api/records", async (req: any, res: any) => {
  let records: Record[] = await getValues();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(records, null, 3));
});

app.get("/shop", async (req: any, res: any) => {
  const shop: Shop = getShop();
  const shopItems: Item[] = shop?.items ?? [];
  const query = req.query.query || "";
  const {count,items,interval} = paginate(shopItems,parseInt(req.query.page) || 1);
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  res.render("index", {
    fullUrl,
    query,
    items,
    link: "shop",
    currentYear: getCurrentYear(),
    count,
    interval,
    hasParams: fullUrl.includes('?'),
    current: parseInt(req.query.page) || 1,
    pages: Math.ceil(count/limit),
  });
});

app.get("/issues", async (req: any, res: any) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const rep: Repo[] = await getProjects();
  res.render("index", {
    fullUrl,
    items: rep,
    link: "issues",
    currentYear: getCurrentYear(),
  });
});

app.get("/issues/:repo", async (req: any, res: any) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const repo: string = req.params.repo;
  const rep: Issue[] = await getIssues(repo);
  res.render("index", {
    fullUrl,
    items: rep,
    repo,
    link: "issues/repo",
    currentYear: getCurrentYear(),
  });
});

app.use('/views', express.static(__dirname + "/views"))
app.use('/res', express.static(__dirname + "/res"))

app.listen(port, () => {
  console.log(`The application is listening on port ${port}`);
});
