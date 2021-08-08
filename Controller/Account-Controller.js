let db = require("../database");
let bcrypt = require ('bcrypt');
let moment = require('moment');
let session = require('express-session');
moment().format();
let saltRounds = 10;


//Gather inputs to create account
function createAccount(request, response){
    let password = bcrypt.hashSync(request.body.password1, saltRounds);
    let emailInUse = checkEmailRegistration(request.body.email);

    if(emailInUse){
        response.redirect("/Email_Invalid");
    }else{
        db.insertAccount(request.body.forename, request.body.surname, request.body.dateOfBirth, request.body.email, request.body.streetName, request.body.postCode,password);
        response.redirect("/Reg_Success"); //Notify success and take to login screen
    }
}

//Gather inputs and check login credentials
async function login(request, response){
    let emailInput = request.body.email;
    let passwordInput = request.body.password;
    let access = false;

    let credentials = await db.getLoginCredentials(emailInput);
    if(credentials !== null){
        if(emailInput === credentials.getEmail()){   //If emails match
            let password = credentials.getPassword();       //then compare passwords
            access = bcrypt.compareSync(passwordInput, password );
        }
    }

    if(access){
        response.redirect("/User_Home/"+credentials.getUserID());
    }else{
        response.redirect("/Login_Error"); //Notify error and remain on login page
    }
}

async function displayAccount(userID, response, passwordNotif, accountNotif){
    let accountObj = await db.getAccount(userID);
    let basketNum = await db.returnNumOfItemsInBasket(userID);
    if(accountObj !== null){
        response.render("User_Account",{
            "firstname": accountObj.getFirstName(),
            "surname": accountObj.getSurname(),
            "dateOfBirth": moment(accountObj.getDateOfBirth()).utc().format('YYYY-MM-DD'),
            "email": accountObj.getEmail(),
            "street": accountObj.getStreet(),
            "postCode": accountObj.getPostCode(),
            "passwordNotif": passwordNotif,
            "accountNotif": accountNotif,
            "basketNum": basketNum
        });
    }
}

//Update account details
function updateAccountDetails(userID, request, response){
    db.updateAccountDetails(
        userID,request.body.firstname, request.body.lastname,request.body.dateOfBirth,
        request.body.email, request.body.street, request.body.postCode
    );
    response.redirect("/Account_Details_Updated");//Notify change
}

//Check if user inputted correct current password before updating to new password
async function checkPassword(userID, request, response){
    let account = await db.getAccount(userID);
    let isValid = false;
    if(account !== null){
        isValid = bcrypt.compareSync(request.body.currentPassword, account.getPassword());
        if(isValid){//If user entered the correct current password
            //then update to new password
            db.updatePassword(userID,bcrypt.hashSync(request.body.newPassword, saltRounds));
        }
    }
    response.redirect("/Password_Update/"+isValid);//Notify success or failure
}

//Delete chat history, basket items related to account and account itself
function deleteAccount(userID,response){
    db.deleteAccount(userID);
    response.redirect("/Welcome");
}

//Check if the email updating to is another that is unused
async function checkUpdateEmail(updateEmail, currentUserEmail){
    let users = await db.getListOfCustomers();
    if(users.length > 0){
        for(let i=0;i<users.length;i++){
            if(users[i].email === updateEmail && users[i].email !== currentUserEmail){
                return true;//Email is being used by another and is not the current email
            }
        }
    }
    return false;
}

//Check if email input is being used by another during registration
async function checkEmailRegistration(inputEmail){
    let users = await db.getListOfCustomers();
    if(users.length > 0){
        for(let i=0;i<users.length;i++){
            if(users[i].email === inputEmail){
                return true;//Email is being used by another
            }
        }
    }
    return false; //Email isn't being used by another
}

module.exports.createAccount = createAccount;
module.exports.deleteAccount = deleteAccount;
module.exports.displayAccount = displayAccount;
module.exports.updateAccountDetails = updateAccountDetails;
module.exports.login = login;
module.exports.checkPassword = checkPassword;
module.exports.checkEmailRegistration = checkEmailRegistration;
module.exports.checkUpdateEmail = checkUpdateEmail;

