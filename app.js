const express = require("express");
   
const app = express();

const jsonParser = express.json();
   
var mongodb = require('mongodb');

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = express.urlencoded({extended: false});

const MongoClient = require("mongodb").MongoClient;
    
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

mongoClient.connect();
const db = mongoClient.db("test");
const collection = db.collection("message");
  
function escape(string) {
    var htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    
    return string.replace(/[&<>"']/g, function(match) {
        return htmlEscapes[match];
    });
};

app.delete("/api/messages/:id", async(req, res)=>{
    try{
        let id = req.params["id"];
        console.log(id)
        const result = await collection.findOneAndDelete({_id: new mongodb.ObjectID(id)});
        console.log(result)
        const messages = result.value;
        if(messages) res.send(messages);
        else res.sendStatus(404);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/publick/index.html");
});

app.get("/api/messages", async(req, res) => {
    try{
        const messages = await collection.find({}).toArray();
        for (var key in messages) {
            messages[key].message = escape(messages[key].message);
        }
        res.send(messages);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

app.post("/api/messages", jsonParser, async(req, res)=> {
         
    if(!req.body) return res.sendStatus(400);
         
    const messag = req.body.message;
    messagg = escape(messag);
    console.log(messagg)
    const messages = {message: messagg};
      
    try{
        await collection.insertOne(messages);
        res.send(messages);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});
   
app.listen(3000, ()=>console.log("Сервер запущен..."));
