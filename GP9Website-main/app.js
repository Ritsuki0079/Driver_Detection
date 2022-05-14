// Require various packages that's needed for the website to work.
const express = require('express')
const path = require("path")
const app = express()
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const ejs = require("ejs")
const { networkInterfaces } = require('os')

// Let nodejs read the files under public folder 
app.use(express.static(path.join(__dirname, "public")));

// Send a log to console saying "new visitor" when there is a new visitor.
app.use((req,res,next)=>{
    console.log("new visitor")
    next()
})

app.get("/",(req,res)=>{
    res.sendFile("./index.html",{root:__dirname})
})

app.get("/about",(req,res)=>{
    res.sendFile("./about.html",{root:__dirname})
})


// Interact with mongodb

// Use the bodyParser method so the program can extract user input.
app.use(bodyParser.urlencoded({extended: true}));

// Connect the GPS mongodb database to the program.
const url = "mongodb+srv://cmuser:cmuser@cluster0.lms4k.mongodb.net/GPS";
mongoose.connect(url, {useNewUrlParser: true}, {useUnifiedTopology: true});

//Create data schema
const schema = {
    district: String
}

const Note = mongoose.model("District", schema);

// app.set("view engine","ejs")

// Declare a post method that can save the user's input to the mongodb database.
app.post("/", function(req,res) {
    let newNode = new Note({
        district: req.body.district
    });
    newNode.save();
    res.redirect("/");   
})

app.listen(process.env.PORT || 3000)