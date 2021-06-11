import express from "express";

const port: number = 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Well done!");
});

app.listen(port, () => {
  console.log(`The application is listening on port ${port}`);
});
