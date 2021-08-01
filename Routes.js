let db = require("./database");
let session = require('express-session');
let bookController = require('./Controller/Book-Controller');


function loadWelcomePage(request,response){
    response.render("Welcome");
}

function loadLoginOrRegisterPage(request,response){
    response.render("Login_or_Register");
}

//User login page
function loadUserLoginPage(request,response){
    response.render("User_Login");
}

//Create user account page
function loadUserRegisterPage(request, response){
    response.render("User_Register");
}

//Add a new book as stock item
function loadAddBookPage(request, response){
    response.render("Add_Book");
}

//View all books as stock items
function loadViewAllStockPage(request,response){
    bookController.getAllStockBooks(request, response);
}

//View a book as a stock item through GET REQUEST PARAMETER
function loadViewStockBookPage(request, response){
    bookController.viewStockBookItem(response, request.params.bookId);
}

function loadUserHomePage(request,response){
    console.log("Home Page " + request.session.user);
    response.render("User_Home");
}

//View books as a customer
function loadViewAllBookItemsPage(request,response){
    console.log("View ALL Books Page " + request.session.user);
    bookController.getAllBookItems(request,response);
}

//View a book as a customer
function loadViewBookPage(request,response){
    console.log("View Book " + request.session.user);
    bookController.viewBookItem(response, request.params.bookId);
}

module.exports.loadWelcomePage = loadWelcomePage;
module.exports.loadLoginOrRegisterPage = loadLoginOrRegisterPage;
module.exports.loadUserLoginPage = loadUserLoginPage;
module.exports.loadUserRegisterPage = loadUserRegisterPage;
module.exports.loadAddBookPage = loadAddBookPage;
module.exports.loadViewAllStockPage = loadViewAllStockPage;
module.exports.loadViewStockBookPage = loadViewStockBookPage;
module.exports.loadUserHomePage = loadUserHomePage;
module.exports.loadViewAllBookItemsPage = loadViewAllBookItemsPage;
module.exports.loadViewBookPage = loadViewBookPage;