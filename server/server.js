
const express= require('express')
const bodyParser=require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors');
const app= express();
const mongoose = require('mongoose');
var Login = require("./models/login")
const bcrypt = require('bcrypt');
const budgetModel = require('./models/budget')
var dbconnections = require('./utility/logindb');

app.use(cors(corsOptions));

var corsOptions = {
  origin: "http://localhost:1234"
};

//connecting

mongoose.connect('mongodb+srv://Spandana14:Spandana14@budget.e47tz.mongodb.net/personal_budget?retryWrites=true&w=majority',function(err,db){
  if (err) throw err;
  console.log("connected to database",db.name)
})

app.use(bodyParser.json())



function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}
app.post('/signup',(req,res)=>{
  
  let hash = bcrypt.hashSync(req.body.password, 10)

  Login.findOne({"username":req.body.email},(err,user)=> {
    if (!user){
  user = new Login({
    username: req.body.email,
    password: hash
});
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)      
    } else {
      let payload = {subject: registeredUser._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
    }
  })
}
else{
  res.status(200).send("user exists")
}
})
})

app.post('/budget_details',(req,res)=>{
  
  budget = new budgetModel({
    username: req.body.username,
     title:req.body.title,
     maxbudget:req.body.maxbudget,
     budget:req.body.budget,
     color:req.body.color      
  });
  
  budget.save();
  res.json(true);

})

app.post("/get_budget_details",(req,res)=>{
  console.log("in get budeget method",req.body);
  budgetModel.find({username:req.body.email},(err,user)=> {
    console.log("user information final",user)
     res.json(user)

})
});
app.post('/dashboard',verifyToken,(req,res)=>{
  res.json(true)
  
});


app.post('/login',(req,res)=>{
  console.log("Entered Login");
  value = req.body.email

  Login.findOne({"username":value},(err,user)=> {
    if (!user){
      res.status(401).send('Invalid Email')
    }
    else{
      var phase=bcrypt.compareSync(req.body.password,user.password);
      if ( phase==false ) {
        res.status(401).send('Invalid Password')
      } else {
        let payload = {subject: user._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
      }
    }
  })
})


  
const data = require('./budgetdetails.json');

app.get('/budget' , (req,res) => {

    res.json(data);

});

app.listen(1234, ()=> console.log('Server listening at 1234'))
