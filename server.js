var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongodb=require("mongodb");
var ObjectId=mongodb.ObjectId;
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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NewsScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get("/",function(req,res){
  db.Article.find()
  .populate("note")
  .then(function(response){
    var mine=response;
    mine.id=ObjectId(mine._id);
    console.log(mine);
    mine.reverse();
  res.render("index",{mine:mine})

  })
})

app.post("/scrape/subreddit/",function(req,res){
  var subToScrapeFrom=req.body.urlToScrape;
  console.log(subToScrapeFrom);
  var urlToScrape="https://old.reddit.com/r/"+subToScrapeFrom;
  console.log(urlToScrape);
  axios.get(urlToScrape).then(function(response) {
    var $ = cheerio.load(response.data);
   
    $("div.thing").each(function(index,element){
      var author = $(element).data("author") || "[deleted]";
      var title=$(element).find("a.title").text();
      var commentLink=$(element).data("permalink");
      var time=$(element).find("time.live-timestamp").text();
      var commentCount=$(element).data("comments-count");
      var score=$(element).data("score");
      var outBoundLink=$(element).data("url");
      var imgSrc=$(element).find("a.thumbnail").find("img").attr("src") || "./gone.jpg";

      if(commentLink===outBoundLink){
        commentLink="https://old.reddit.com"+commentLink;
        outBoundLink="https://old.reddit.com"+outBoundLink;
      } else{
        commentLink="https://old.reddit.com"+commentLink;
      }
      // console.log(index);
      // console.log(author);
      // console.log(title);
      // console.log(commentLink);
      // console.log(time);
      // console.log(commentCount +"comments");
      // console.log(score +"upvotes");
      // console.log(outBoundLink);
      // console.log(imgSrc);

      console.log("-----------------------------------");
      // console.log(db.Article.find({commentLink:commentLink}).limit(1).size());
      console.log("---------------------------------------")
      db.Article.find({
        commentLink:commentLink

      })
      .limit(1)
      .then(function(response){
        console.log(response.length===0);
        if(response.length>0){
          console.log("made");
        } else{
          db.Article.create({
            author:author,
            title:title,
            commentLink:commentLink,
            time:time,
            score:score,
            commentCount:commentCount,
            outBoundLink:outBoundLink,
            imgSrc:imgSrc
          });
        }
      })
     
      
    });
    res.status(202).end();

}).catch(function(err){
  console.log(err);
});
})

app.post("/newnote/:id",function(req,res){
  console.log(req.body);
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push:{note: dbNote._id} }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });