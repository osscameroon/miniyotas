import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import { getValues, IRecord } from "./googlesheet";

enum E_ENVIRONMENT {
  dev = "dev",
  stage = "stage",
  prod = "production",
}

const port: number = 3000;
const app = express();
const STATIC_FILES_DIRECTORY =
  process.env.ENVIRONMENT == E_ENVIRONMENT.dev ? "../public/" : "..";

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", ".hbs");
app.get("/", async (req: any, res: any) => {
  const records: IRecord[] = await getValues();

  res.render("index", {
    records,
  });
});

app.listen(port, () => {
  console.log(`The application is listening on port ${port}`);
});
