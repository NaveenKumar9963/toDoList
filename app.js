const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://naveen:nani9963@cluster0.r1wiuvo.mongodb.net/todolistDB", {
  useNewUrlParser: true,
}).then( () => {
  console.log("Database Connected");
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

const toDo1 = new Item({
  name: "Welcome to to-do-list!",
});
const toDo2 = new Item({
  name: "Hit the + button to add a new item.",
});
const toDo3 = new Item({
  name: "<-- Hit this to dlete an item.",
});

const itemArray = [toDo1, toDo2, toDo3];

const listSchema = {
  name: String,
  item: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  Item.find({}).then((foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(itemArray).then(() => {
        console.log("Data Saved");
        res.redirect("/");
      });
      
    } else {
      res.render("list", { ListTitle: "Today", Lists: foundItems });
    }
  });
});

app.get("/:name", (req, res) => {
  const custom_list_name = _.capitalize(req.params.name);

  List.findOne({ name: custom_list_name }).then((collections) => {
    if (!collections) {
      //Create a new data list
      const list = new List({
        name: custom_list_name,
        item: itemArray,
      });
      list.save();
      res.redirect("/" + custom_list_name);
    } else {
      //Showing existed data list
      res.render("list", {
        ListTitle: collections.name,
        Lists: collections.item,
      });
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.button;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.item.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const list_id = req.body.checkBox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete({ _id: list_id }).then(() => {
      console.log("Item Deleted");
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { item: { _id: list_id } } }
    ).then((foundList) => {
      if (foundList) {
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server Started at on port : 3000");
});
