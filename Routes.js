let db = require("./database");
let session = require('express-session');

function loadWelcomePage(request,response){
    response.render("Welcome");
}

function loadLoginOrRegisterPage(request,response){
    response.render("Login_or_Register");
}

function loadUserLoginPage(request,response){
    response.render("User_Login");
}

function loadUserRegisterPage(request, response){
    response.render("User_Register");
}

function loadAddBookPage(request, response){
    response.render("Add_Book");
}
module.exports.loadWelcomePage = loadWelcomePage;
module.exports.loadLoginOrRegisterPage = loadLoginOrRegisterPage;
module.exports.loadUserLoginPage = loadUserLoginPage;
module.exports.loadUserRegisterPage = loadUserRegisterPage;
module.exports.loadAddBookPage = loadAddBookPage;