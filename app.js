//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const mongoKey = require(__dirname + "/mongoKey.js");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hello I am Amogh Shetty, a fresh computer science graduate, possessing keen interest in developing user-friendly applications using the existing technological skillset. I am looking forward to hone my skills further for the benefit of organization and self. This is a my Blog Website which I have built.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const str = mongoKey.getKey();
mongoose.connect(str, { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("blog", blogSchema);

app.get("/", function (req, res) {
  Blog.find({}, (err, foundBlogs) => {
    let posts = [];
    if (!err) posts = foundBlogs;
    else {
      console.log(err);
    }
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };

  const newPost = new Blog({
    title: post.title,
    content: post.content,
  });

  await newPost.save();

  res.redirect("/");
});

app.get("/posts/:postName", function (req, res) {
  const requestedId = req.params.postName;

  Blog.findById(requestedId, (err, post) => {
    if (!err) {
      res.render("post", {
        post: post,
      });
    }
  });
});

app.get("/delete/:id", (req, res) => {
  const requestedId = req.params.id;
  Blog.findByIdAndDelete(requestedId, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
