import express from "express";
import exphbs from "express-handlebars";
import * as helpers from "./helpers/handlebars";
import { getValues, Record } from "./googlesheet";

enum E_ENVIRONMENT {
  dev = "dev",
  stage = "stage",
  prod = "production",
}

const port: number = 3000;
const app = express();

//Set view path
app.set('views', __dirname + '/views');
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


app.get("/", async (req: any, res: any) => {
  const records: Record[] = await getValues();

  res.render("index", {
    records,
    link: 'contributors',
  });
});

app.get("/shop", async (req: any, res: any) => {
  const records: Record[] = await getValues();

  res.render("index", {
    records,
    link: 'shop',
  });
});

app.get("/contributors", async (req: any, res: any) => {
  const records: Record[] = await getValues();

  res.render("index", {
    records,
    link: 'contributors',
  });
});


app.listen(port, () => {
  console.log(`The application is listening on port ${port}`);
});
