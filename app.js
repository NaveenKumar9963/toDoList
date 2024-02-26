const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = [];
const Work_items = [];

app.get("/", (req, res) => {
  const day = date.getDate();

  res.render("list", { ListTitle: day, Lists: items });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  console.log(req.body);
  if (req.body.button === "Work") {
    Work_items.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});
app.get("/work", (req, res) => {
  res.render("list", { ListTitle: "Work List", Lists: Work_items });
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server Started at on port : 3000");
});
