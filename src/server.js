import Express from "express";

const app = Express();

app.use(Express.json());

const PORT = 3001;

app.get("/", (req, res) => {
  res.status(200).send();
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
