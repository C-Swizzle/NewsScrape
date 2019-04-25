var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//init HB
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Make public a static folder
//this serves all JS files in public to the HB files
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get("/",function(req,res){
  res.render("index",{})
})

app.post("/scrape/subreddit/",function(req,res){
  var subToScrapeFrom=req.body.urlToScrape;
  console.log(subToScrapeFrom);
  var urlToScrape="https://old.reddit.com/r/"+subToScrapeFrom;
  console.log(urlToScrape);
  axios.get(urlToScrape).then(function(response) {
    var $ = cheerio.load(response.data);
    // console.log($);
    var resultArr=[];
    $("div.thing").each(function(index,element){
      var author = $(element).data("author");
      var title=$(element).find("a.title").text();
      var link=$(element).data("permalink");
      var time=$(element).find("time.live-timestamp").text();
      var commentCount=$(element).find("a.comments").text();
      console.log(index);
      console.log(author);
      console.log(title);
      console.log(link);
      console.log(time);
      console.log(commentCount);
      console.log("-----------------------------------")
    })
    // $("p.title").each(function(index,element){
    //   // console.log(element);
    //   console.log(index);
    //   var title= $(element).text();
    //   var link = $(element).children().attr("href");
    //   resultArr.push({
    //     title:title,
    //     link:link
    //   });
    //   console.log("---------------------------------------------");
    // })
    // $("time.live-timestamp").each(function(index,element){
    //   resultArr[index].time=$(element).text();
      
    // });
    // $("a.author").each(function(index,element){
    //   console.log($(element).text())

    // })
    console.log(resultArr);
}).catch(function(err){
  console.log(err);
});
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });