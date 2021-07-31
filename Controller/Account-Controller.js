let db = require("../database");
let bcrypt = require ('bcrypt');
let moment = require('moment');
let session = require('express-session');
moment().format();
let saltRounds = 10;


//Gather inputs to create account
function createAccount(request, response){
    let password = bcrypt.hashSync(request.body.password1, saltRounds);
    db.insertAccount(request.body.forename, request.body.surname, request.body.dateOfBirth, request.body.email, request.body.streetName, request.body.postCode,password);
    response.redirect("/User_Login");
    response.end();
}

module.exports.createAccount = createAccount;

