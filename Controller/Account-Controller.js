let db = require("../database");
let bcrypt = require ('bcrypt');
let moment = require('moment');
let session = require('express-session');
moment().format();
let saltRounds = 10;

//Gather inputs to create account
function createAccount(request, response){

}

module.exports.createAccount = createAccount;