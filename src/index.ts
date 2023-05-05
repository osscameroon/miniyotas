import path from "path";
import express, { Request, Response } from "express";
import exphbs from "express-handlebars";
import Fuse from "fuse.js";
import * as helpers from "./helpers/handlebars";
import { getYotas, Record } from "./yotas";
import { getShop, Item, Shop } from "./shop";
import { getIssues, Issue } from "./issues";

const port = 3000;
const limit  = 12;
const app = express();

const getCurrentYear = () => {
  const d = new Date();
  return d.getFullYear();
}

app.locals.gtag = process.env.GOOGLE_ANALYTICS_ID;

// Set view path
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

const paginate = (items: Item[], page: number) => {
  const count = items.length;
  const startIndex = (page - 1) * limit;
  const endIndex  = page * limit;
  items = items.slice(startIndex,endIndex);
  const interval = (Number(page) > 5 ? Number(page) - 4 : 1);
  return {count,items,interval};
};

const handleContributors = async (req: Request, res: Response) => {
  const query = req.query.query as string | undefined ;
  const page = req.query.page as string | undefined ;
  let records: Record[] = await getYotas();

  records = getRecordsMatchingQuery(query ?? "", records);
  const { count, items, interval } = paginate(records, parseInt(page ?? "1"));
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
    current: parseInt(page ?? "1"),
    pages: Math.ceil(count / limit),
  });
};

app.get("/", handleContributors);

app.get("/contributors", handleContributors);

app.get("/v1/api/records", async (req, res) => {
  let records: Record[] = await getYotas();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(records, null, 3));
});

app.get("/shop", async (req, res) => {
  const shop: Shop = getShop();
  const shopItems: Item[] = shop?.items ?? [];
  const query = req.query.query || "";
  const page = req.query.page as string | undefined ;
  const { count, items, interval } = paginate(shopItems,parseInt(page ?? "1") || 1);
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
    current: parseInt(page ?? "1"),
    pages: Math.ceil(count/limit),
  });
});

app.get("/issues", async (req: Request, res: Response) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const issues: Issue[] = await getIssues();
  const query = req.query.query || "";
  const page = req.query.page as string | undefined ;

  const { count, items, interval } = paginate(issues,parseInt(page ?? "1"));

  res.render("index", {
    fullUrl,
    query,
    items,
    link: "issues",
    currentYear: getCurrentYear(),
    count,
    interval,
    hasParams: fullUrl.includes('?'),
    current: parseInt(page ?? "1"),
    pages: Math.ceil(count / limit),
  });
});

app.use('/views', express.static(__dirname + "/views"));
app.use('/res', express.static(__dirname + "/res"));
app.use(express.static(path.resolve(__dirname, '../public')));
app.listen(port, () => {
  console.log(`Application started on URL http://localhost:${port} 🎉`);
});
