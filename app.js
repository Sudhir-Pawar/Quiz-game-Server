const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const port = 9000;

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect(
    "mongodb://localhost:27017/QuizDB",
    { useUnifiedTopology: true, useNewUrlParser: true },
    function (err) {
        if (!err) console.log("Connnect to database");
        else console.log(err);
    }
);

const QuestionSchema = new mongoose.Schema({
    question: String,
    options: Array
});

const Question = new mongoose.model("questions", QuestionSchema);

app.get("/questions", function (req, res) {
    Question.find(function (err, questions) {
        err ? console.log(err) : res.send(questions);
    });
});

app.post("/questions", function (req, res) {
    if (req.body.options.length > 4) res.send("options size limited to 4");
    else {
        const qTemp = new Question({
            question: req.body.question,
            options: req.body.options
        });

        qTemp.save(function (err) {
            err ? console.log(err) : res.send("Question added to database");
        });
    }
});

app.delete("/questions", function (req, res) {
    Question.deleteMany(function (err) {
        err ? console.log(err) : res.send("All questions deleted");
    });
});

app.get("/questions/:question", function (req, res) {
    let question = req.params.question;
    question.endsWith("?") ? question : (question = question.concat("?"));
    Question.findOne({ question: question }, function (err, foundQues) {
        console.log(req.params.question);
        if (foundQues) {
            res.send(foundQues);
        } else {
            res.send("No such question");
        }
    });
});

app.put("/questions/:question", function (req, res) {
    let question = req.params.question;
    question.endsWith("?") ? question : (question = question.concat("?"));

    Question.update(
        { question: question },
        { question: req.body.question, options: req.body.options },
        { overwrite: true },
        function (err) {
            if (!err) res.send("Updated successfully");
        }
    );
});

app.patch("/questions/:question", function (req, res) {
    let question = req.params.question;
    question.endsWith("?") ? question : (question = question.concat("?"));

    Question.update({ question: question }, { $set: req.body }, function (err) {
        if(!err)
            res.send("Updated successfully");
     });
});
app.delete("/questions/:question",function(req,res){
    let question = req.params.question;
    question.endsWith("?") ? question : (question = question.concat("?"));

    Question.deleteOne({question : question},function(err){
        if(!err)
            res.send("Deleted successfully");    
    });
});
app.listen(port, function () {
    console.log("Server listening on port 9000");
});
