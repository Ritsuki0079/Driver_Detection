<<<<<<< HEAD
const HTTP = require("http")
const PORT = process.env.PORT || 3000
const FS = require("fs")
const SERVER = HTTP.createServer(function(req,res) {

    res.setHeader("Content-Type","text/html")

    FS.readFile("./index.html",(err,data)=>{
        if(err) {
            console.log("Something is wrong", err)
        } else {
            res.write(data)
        }
        res.end()
    })
})

SERVER.listen(PORT, function(err) {
    if (err) {
        console.log("Something is wrong", err)
    } else {
        console.log("Server is now listening on port:", PORT)
    }
})

=======
const HTTP = require("http")
const PORT = process.env.PORT || 3000
const FS = require("fs")
const SERVER = HTTP.createServer(function(req,res) {

    res.setHeader("Content-Type","text/html")

    FS.readFile("./index.html",(err,data)=>{
        if(err) {
            console.log("Something is wrong", err)
        } else {
            res.write(data)
        }
        res.end()
    })
})

SERVER.listen(PORT, function(err) {
    if (err) {
        console.log("Something is wrong", err)
    } else {
        console.log("Server is now listening on port:", PORT)
    }
})

>>>>>>> 3415837c59bd4fa942342c8a4ec48fc82683c1c5
