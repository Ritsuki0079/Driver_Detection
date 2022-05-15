// Require various packages that's needed for the website to work.
const express = require('express')
const path = require("path")
const app = express()
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const ejs = require("ejs")
const { networkInterfaces } = require('os')
//import alert from "alert"
const alert = require("alert")

/*
const tf = require('@tensorflow/tfjs');
const tfn = require('@tensorflow/tfjs-node');
const tfnode = require('@tensorflow/tfjs-node');
*/
//  const handler = tfn.io.fileSystem("model.json");

/*
    async function loadmodel() {
        console.log( "Loading model..." );
        const model = await tf.loadLayersModel(handler);
        console.log( "Model loaded." );
        console.log(model)
        demosSection.classList.remove('invisible');
        const zeros = tf.zeros([1, 224, 224, 3]);
        console.log(model.predict(zeros).print())
    };
loadmodel();
*/

/*
    async function loadModel(){
        const handler = tfnode.io.fileSystem('model.json');
        const model = await tf.loadLayersModel(handler);
        console.log("Model loaded")
    }
loadModel();
*/

/*
async function loadModel(){
    try {
        //const net = await loadGraphModel("http://127.0.0.1:8080/model.json");
        //const net = await loadGraphModel("https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json");
        //const net = await tf.loadGraphModel("https://raw.githubusercontent.com/NickSO0128/models/tree/main/tfjsexport/model.json");
        const net = await loadLayersModel("C:\Users\soshi\OneDrive\桌面\website_test\GP9Website-new\public\model.json");
        //const obj = await net.predict(video);
        console.log(net);
        //net.predict();
    } catch (err) {
        console.log(err)
    }
}
loadModel();
*/



// Let nodejs read the files under public folder 
app.use(express.static(path.join(__dirname, "public")));

// Send a log to console saying "new visitor" when there is a new visitor.
app.use((req,res,next)=>{
    console.log("new visitor")
    next()
})

app.get("/",(req,res)=>{
    //res.sendFile("./index.html",{root:__dirname})
    res.render("index",{test:"test"})
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

app.set("view engine","ejs")
app.set("views","page")
// Declare a post method that can save the user's input to the mongodb database.
app.post("/", function(req,res) {
    let newNode = new Note({
        district: req.body.district
    });
    newNode.save();
    res.redirect("/");   
})

app.listen(process.env.PORT || 3000)