let db = require("./database");
let session = require('express-session');
let bookController = require('./Controller/Book-Controller');
let basketController = require('./Controller/Basket-Controller');
let accountController = require('./Controller/Account-Controller');
let chatController = require('./Controller/Chat-Controller');
let orderController = require('./Controller/Order-Controller');

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

//Load customer support chat room as ADMIN
function loadEmployeeChatRoom(request,response){
    chatController.displayChatHistoryForAdmin("610580434665755c249b5b9e", response);
}

//View all orders in summarized version as employee
function loadViewOrdersPage(request,response){
    orderController.viewOrders(response);
}

//View a specific order as employee
function loadViewInvoiceOrderPage(request,response){
    orderController.viewOrderEmployee(request.params.orderId, response);
}

//Deliver an order and update status
function deliverOrder(request,response){
    orderController.deliverOrder(request.params.orderId, response);
}

//Show user's home page
function loadUserHomePage(request,response){
    orderController.viewCustomerOrders(request.session.user, response);
}

//View books as a customer
function loadViewAllBookItemsPage(request,response){
    bookController.getAllBookItems(request,response);
}

//View a book as a customer
function loadViewBookPage(request,response){
    bookController.viewBookItem(response, request.params.bookId);
}

//Pass on session user to basket controller
function addToBasket(request,response){
    basketController.checkBasket(request.session.user, response, request);
}

//Remove item from basket
function removeItemFromBasket(request,response){
    basketController.removeItemFromBasket(request.session.user,request,response);
}

//Process basket items into an order
function checkoutBasket(request, response){
    basketController.checkout(request.session.user, response);
}

//View order as customer
function viewCustomerOrder(request,response){
    orderController.viewOrderCustomer(request.params.orderId, response);
}

//Update account
function updateAccount(request,response){
    accountController.updateAccountDetails(request.session.user, request, response);
}

//Update account password
function updatePassword(request,response){
    accountController.checkPassword(request.session.user,response);
}

//Display items in customer's basket
function loadBasketPage(request,response){
    basketController.displayBasket(request.session.user, response);
}

//Display customer support chatroom
function loadCustomerSupportPage(request,response){
    chatController.displayChatHistoryForCustomers(request.session.user,response);
}

function loadAccountPage(request,response){
    accountController.displayAccount(request.session.user, response);
}



module.exports.loadWelcomePage = loadWelcomePage;
module.exports.loadLoginOrRegisterPage = loadLoginOrRegisterPage;
module.exports.loadUserLoginPage = loadUserLoginPage;
module.exports.loadUserRegisterPage = loadUserRegisterPage;

module.exports.loadAddBookPage = loadAddBookPage;
module.exports.loadViewAllStockPage = loadViewAllStockPage;
module.exports.loadViewStockBookPage = loadViewStockBookPage;
module.exports.loadEmployeeChatRoom = loadEmployeeChatRoom;
module.exports.loadViewOrdersPage = loadViewOrdersPage;
module.exports.loadViewInovoiceOrderPage = loadViewInvoiceOrderPage;
module.exports.deliverOrder = deliverOrder;

module.exports.loadUserHomePage = loadUserHomePage;
module.exports.loadViewAllBookItemsPage = loadViewAllBookItemsPage;
module.exports.loadViewBookPage = loadViewBookPage;
module.exports.loadBasketPage = loadBasketPage;
module.exports.addToBasket = addToBasket;
module.exports.removeItemFromBasket = removeItemFromBasket;
module.exports.checkoutBasket = checkoutBasket;
module.exports.viewCustomerOrder = viewCustomerOrder;
module.exports.updateAccount = updateAccount;
module.exports.updatePassword = updatePassword;
module.exports.loadCustomerSupportPage = loadCustomerSupportPage;
module.exports.loadAccountPage = loadAccountPage;