//jshint esversion: 6

const express = require("express")
const ejs= require("ejs");
const bodyParser=require("body-parser")
const { appendFile } = require("fs")
const app=express()
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.static("public"))
var firebase = require('firebase');
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")


var firebaseConfig = {
    apiKey: "API-KEY",
    authDomain: "intricate-will-294211.firebaseapp.com",
    projectId: "intricate-will-294211",
    storageBucket: "intricate-will-294211.appspot.com",
    messagingSenderId: "791699583534",
    appId: "1:791699583534:web:9992e3c7d6754370e8e5bf",
    measurementId: "G-7G1SF0JB9D"
    };
firebase.initializeApp(firebaseConfig);
  
let ref = firebase.database().ref();


app.get('/',(req,res)=>{
res.render("signIn")
})

app.get('/signup',(req,res)=>{
    res.render("signUp")
})

app.post('/',(req,res)=>{
    // console.log(" -",req.body.email," - ",req.body.password)
    const username = req.body.email;
    const password = req.body.password;
    ref.on("value", function(snapshot){
        var regString = JSON.stringify(snapshot.val(), null, 2);
        var regList= JSON.parse(regString);
        var totalRecord =  snapshot.numChildren();
        for(i=0;i<totalRecord;i++){
            if(Object.values(regList)[i].email == username){
                //  console.log("true");
                bcrypt.compare(password, Object.values(regList)[i].password, (err, result)=>{
                  if(result === true) res.render("success");
                  else res.redirect('/');
                });
            }
            }
        })
})

app.post('/signup',(req,res)=>{
    // console.log(" -",req.body.email," - ",req.body.password)
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user={
            email:req.body.email,
            password:hash
          }
        ref.push().set(user);
        res.render("success");
    });
})

app.listen(8000, ()=>{
    console.log("Started listening on port 8000")
})