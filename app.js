const express = require('express');
const app = express();
const mongoose = require("mongoose");
const User = require ('./models/users')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
var key="password"
var algo = "aes256"

mongoose.connect("mongodb://localhost:27017/Auth",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to database");
  })
  

app.post('/register',jsonParser, function(req,res){
    var cipher = crypto.createCipher(algo,key);
    var encrypted=cipher.update(req.body.password,'utf8','hex')
    +cipher.final('hex')
    console.log(encrypted);
    const data = new User({
        _id:mongoose.Types.ObjectId(),
        firstName:req.body.name,
        lastName:req.body.name,
        email:req.body.email,
        password:encrypted,
        address:req.body.address,
        mobileNumber:req.body.number,
    })
    data.save().then((result)=>{
        jwt.sign({result},jwtkey,{expiresIn:'300s'},(err,token)=>{
            res.status(201).json({token})
        })
        // res.status(201).json(result)
    }).catch((err)=>{
        console.log(err);
    })
    res.end("Succeesful")
})  

app.post('/login',jsonParser,function(req,res){
    User.findOne({email:req.body.email}).then((data)=>{
        var decipher = crypto.createDecipher(algo,key);
        var decrypted = decipher.update(data.password,'hex','utf8')
        + decipher.final('utf8');
        if(decrypted==req.body.password)
        {
            jwt.sign({data},key,{expiresIn:'300s'},(err,token)=>{
                res.status(200).json({token})
            })
        }
        // console.log("decrypted",decrypted);
        res.json(data)
        // res.end("Succeesful")
    })
})
app.listen(5000);

