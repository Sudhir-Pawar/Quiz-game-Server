const express = require("express");
const bodyparser = require("body-parser");
const mongoose=require("mongoose");
const port=9000;
mongoose.connect("mongodb://localhost:27017/QuizDB",{ useNewUrlParser: true } ,function(err){
    if(!err)
        console.log("Connnect to database");
    else
        console.log(err);
});

const Questions = new mongoose.Schema({
    question : String,
    options: Array
});

const Question = new mongoose.model("questions",Questions);

const q1=new Question({
    question : "What was initial name of Java",
    options : ["Oak","palm","Oava","Javascript"]
});

q1.save();

const app=express();
app.use(bodyparser.urlencoded({extended : true}));

app.get("/",function(req,res){
   

});

app.listen(port,function(){
    console.log("Server listening on port 9000");
});