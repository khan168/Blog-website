//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
mongoose.connect(
  process.env.DB_HOST+"://" + process.env.DB_USERNAME+":" +  process.env.DB_PASSWORD + "@cluster0.dnivg54.mongodb.net/blogDB?retryWrites=true&w=majority"
);
var _ = require("lodash");

//create schema and model
const bpschema={
  title:String,
  body:String
}

const Post = mongoose.model("post",bpschema);

const homeStartingContent = "A blog post is an individual web page on your website that dives into a particular sub-topic of your blog.\
For instance, let's say you start a fashion blog on your retail website. One blog post might be titled, 'The Best Fall Shoes for 2019'. The post ties back to your overall blog topic as a whole (fashion), but it also addresses a very particular sub-topic (fall shoes).\
Blog posts allow you to rank on search engines for a variety of keywords. In the above example, your blog post could enable your business to rank on Google for 'fall shoes'. When someone searches for fall shoes and comes across your blog post, they have access to the rest of your company's website. They might click 'Products' after they read your post, and take a look at the clothing items your company sells.";

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



const app = express();

app.set("view engine", "ejs");



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/", (req, res) => {
  Post.find({},(err,posts)=>{
    if(!err){
    res.render("home", { content: homeStartingContent, posts: posts });
    }else{
      console.log(err);
    }
  })
  
});

app.get("/contact", (req, res) => {
  res.render("contact", { content: contactContent });
});

app.get("/about", (req, res) => {
  res.render("about", {content: aboutContent });
});

app.get("/compose", (req, res) => {
  res.render("compose", {});
});

app.post("/compose", (req, res) => {
  var title = req.body.title;
  var body = req.body.postbody;
  const newpost = new Post({title:title,body:body});
  newpost.save();
  res.redirect("/");
});

app.get("/posts/:postid",function(req,res){
  var id =req.params.postid;
  Post.findById({_id:id},function(err,p){
    if(!err){
    res.render("post",{p});
    }else{
      res.send("Not found");
    }
  });
  
});

app.post("/posts/:postid", async (req, res) => {
  try{
  await Post.deleteOne({ _id: req.params.postid });
  return res.redirect("/");
  }catch{
    res.send("error");
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
