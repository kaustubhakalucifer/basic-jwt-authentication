const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
const config = require('./config');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/tkcs/jwt',(req,res)=>{
    console.log("Without Basic-> ",req.headers.authorization);
    console.log("With Basic -> ",req.headers.authorization.indexOf('Basic '))

    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    console.log({"username":username,"password":password});
    var token = jwt.sign({"username":username,"password":password},config.secret,{
        expiresIn:20
    })
    res.status(200).json({"token":token});
});

app.post('/tkcs/verifyToken',(req,res)=>{

    async function main(){
        try{
            let withBearertoken = req.headers['authorization'];
            let splitToken = withBearertoken.split('Bearer ')[1];
            console.log(splitToken);
            var result = jwt.verify(splitToken,config.secret);
        }catch(e){
            console.log('Error -> ',e);
            var result = e.message;
        }
        res.send(result);
    }
    main();
});

app.listen(3000,console.log('Listening on port 3000'));