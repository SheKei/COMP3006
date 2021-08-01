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

//Gather inputs and check login credentials
async function login(request, response){
    let emailInput = request.body.email;
    let passwordInput = request.body.password;
    console.log("email = " + emailInput);
    console.log("password = " + passwordInput);

    let access = false;

    let credentials = await db.getLoginCredentials(emailInput);
    //console.log(credentials[0] !== null);
    //console.log(credentials[0].getFirstName());
    console.log("after db called");
    if(credentials !== null){
        if(emailInput === credentials.getEmailAddress()){   //If emails match
            let password = credentials.getPassword();       //then compare passwords
            access = bcrypt.compareSync(passwordInput, password );
        }
    }

    if(access){
        response.redirect("/User_Home/"+credentials.getUserID());
    }else{
        response.redirect("/User_Login");
    }
}

module.exports.createAccount = createAccount;
module.exports.login = login;

