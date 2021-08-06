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
    let access = false;

    let credentials = await db.getLoginCredentials(emailInput);
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

async function displayAccount(userID, response){
    let accountObj = await db.getAccount(userID);
    if(accountObj !== null){
        response.render("User_Account",{
            "firstname": accountObj.getFirstName(),
            "surname": accountObj.getSurname(),
            "dateOfBirth": moment(accountObj.getDateOfBirth()).utc().format('YYYY-MM-DD'),
            "email": accountObj.getEmail(),
            "street": accountObj.getStreet(),
            "postCode": accountObj.getPostCode()
        });
    }
}

//Update account details
function updateAccountDetails(userID, request, response){
    db.updateAccountDetails(
        userID,request.body.firstname, request.body.lastname,request.body.dateOfBirth,
        request.body.email, request.body.street, request.body.postCode
    );
    response.redirect("/User_Account");
}

//Check if user inputted correct current password before updating to new password
async function checkPassword(userID, request, response){
    let account = await db.getAccount(userID);
    if(account !== null){//If user entered the correct current password
        if(bcrypt.compareSync(request.body.currentPassword, account.getPassword())){
            //then update to new password
            db.updatePassword(userID,bcrypt.hashSync(request.body.newPassword, saltRounds));
        }
    }
    response.redirect("/User_Account");
}

module.exports.createAccount = createAccount;
module.exports.displayAccount = displayAccount;
module.exports.updateAccountDetails = updateAccountDetails;
module.exports.login = login;
module.exports.checkPassword = checkPassword;

