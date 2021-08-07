let mongoose = require("mongoose");
let moment = require('moment');
moment().format();

//CONNECT TO DATABASE
let dbUrl = "mongodb://localhost:27017/bookstoredb";
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true});

//IMPORT SCHEMAS
let Account = require("./Schema/Account-Schema").Account;
let Book = require("./Schema/Book-Schema").Book;
let Basket = require('./Schema/Basket-Schema').Basket;
let Chat = require("./Schema/Chat-Schema").Chat;
let Order = require("./Schema/Order-Schema").Order;

//IMPORT MODEL CLASSES
let BookClass = require("./Model/Book");
let Credentials = require("./Model/Credentials");
let AccountClass = require("./Model/Account");
let BasketClass = require('./Model/Basket');
let ChatClass = require("./Model/Chat");
let OrderClass = require("./Model/Order");
let OrderItemClass = require("./Model/Order_Item");

//PROCEDURES

//Create a new book item after stock form submission
function insertBook(authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres, image){
    let bookObj = {authorForename:authorForename, authorSurname: authorSurname, bookName:bookName, stockPrice:stockPrice, sellingPrice:sellingPrice, stockAmount:stockAmount, synopsis:synopsis, genres: genres, image:image};
    Book.collection.insertOne(bookObj, function(err){
        if(err){console.log(err);}
    });
}

//Delete book using book ID
function deleteBook(bookID){
    Book.collection.deleteOne({_id:mongoose.Types.ObjectId(bookID)});
}

//Update details of a stock book
function updateBook(bookID,authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres, image){
    Book.collection.updateOne(
        {_id:mongoose.Types.ObjectId(bookID)},
        {
            $set:{authorForename:authorForename, authorSurname: authorSurname, bookName:bookName, stockPrice:stockPrice, sellingPrice:sellingPrice, stockAmount:stockAmount, synopsis:synopsis, genres: genres, image:image}
        });
}

//Update file image for an existing book
function updateBookImage(bookID, imageName){
    Book.collection.updateOne(
        {_id:mongoose.Types.ObjectId(bookID)},
        {$set:{image:imageName}}
    );
}

//Get all books and return as an array of book objects
async function getAllBooks(){
    let books = await Book.find({});
    let bookObjArray = [];
    if(books[0] !== undefined){
        for(let i=0; i<books.length; i++){ //For each result
           bookObj = new BookClass(        //Convert to a book obj
                books[i]._id, books[i].authorForename, books[i].authorSurname,
                books[i].bookName, books[i].stockPrice, books[i].sellingPrice,
                books[i].stockAmount, books[i].synopsis, books[i].genres, books[i].image
            );
            bookObjArray.push(bookObj);    //Then add to array
        }
        return bookObjArray;
    }else{return null;}                    //Return null if no results
}

//Get one book using its id and return it as a book object
async function getOneBook(bookID){
    let books = await Book.find({_id: bookID});
    if(books[0] !== undefined){
        return new BookClass(
            books[0]._id, books[0].authorForename, books[0].authorSurname,
            books[0].bookName, books[0].stockPrice, books[0].sellingPrice,
            books[0].stockAmount, books[0].synopsis, books[0].genres, books[0].image
        );
    }else{return null;}
}

//Return list of customers to talk to
async function getListOfCustomers(){
    return await Account.find({});
}

//Create a new account upon registration
function insertAccount(firstname, lastname, birthday, email, streetName,postCode,password){
    let accountObj = {firstname: firstname, lastname: lastname, birthday:birthday, email:email, streetName:streetName, postCode:postCode, password:password};
    Account.collection.insertOne(accountObj, function(err){
       if(err){console.log(err);}
    });
}

//Delete account, chat history and any basket items using Userid
function deleteAccount(userID){
    Chat.collection.deleteOne({sender: userID});
    Chat.collection.deleteOne({recipient: userID});
    Basket.collection.deleteOne({userID: userID});
    Account.collection.deleteOne({_id:mongoose.Types.ObjectId(userID)});
}

//Get all account details for display
async function getAccount(userID){
    let account = await Account.find({_id: mongoose.Types.ObjectId(userID)});
    let accountObj = null;
    if(account[0] !== undefined){
        accountObj = new AccountClass(account[0]._id, account[0].firstname, account[0].lastname,
        account[0].birthday, account[0].email, account[0].streetName,
        account[0].postCode, account[0].password);
    }
    return accountObj;
}

//Find an existing account using email address
async function checkLoginCredentials(inputEmail){
    let credentials = await Account.find({email: inputEmail});
    let loginAccount = null;
    if(credentials[0] !== undefined){
        loginAccount = new Credentials(credentials[0].email, credentials[0].password);
    }
    return loginAccount;
}

//Get account credentials
async function getLoginCredentials(emailAddress){
    let account = await Account.find({email: emailAddress});
    let theAccount = null;
    if(account[0] !== undefined){
        theAccount = new AccountClass(account[0]._id,account[0].firstname,account[0].lastname, account[0].birthday, account[0].email, account[0].streetName, account[0].postCode, account[0].password);
    }
    return theAccount;
}

//Update the account details
function updateAccountDetails(userID, firstname, lastname,birthday, email, streetName,postCode ){
    Account.collection.updateOne(
        {_id: mongoose.Types.ObjectId(userID)},
        {$set:{userID:userID, firstname:firstname, lastname:lastname,
                birthday:birthday, email:email, streetName:streetName,postCode:postCode}});
}

//Change password of account
function updatePassword(userID, newPassword){
    Account.collection.updateOne(
        {_id: mongoose.Types.ObjectId(userID)},
        {$set:{password:newPassword}});
}

//Check if there is already item is already in basket
async function checkBasket(userID, itemID, quantity){
    let basket = await Basket.find({userID:userID, itemID:itemID});

    if(basket[0] === undefined){//If item is not in basket, add into basket
        let basketObj = {userID: userID, itemID: itemID, quantity:quantity};
        Basket.collection.insertOne(basketObj, function(err){if(err){console.log(err);}});
    }else{
        Basket.collection.updateOne(//Else update quantity
            {userID: userID, itemID: itemID},
            {$set:{quantity:parseInt(basket[0].quantity) + parseInt(quantity)}}
        );
    }
}

//Remove an item from basket
function removeItemFromBasket(userID, itemID){
    Basket.collection.deleteOne({userID: userID, itemID: itemID});
}

//Get all items in a user's basket
async function getAllItemsInBasket(userID){
    let basket = await Basket.find({userID:userID});
    let basketItems = [];
    if(basket.length > 0){
        for(let i=0;i<basket.length;i++){
            let item = await Book.find({_id:mongoose.Types.ObjectId(basket[i].itemID)});
            let itemObj = new BasketClass(basket[i]._id, basket[i].userID, basket[i].itemID, item[0].image, item[0].bookName, basket[i].quantity, item[0].sellingPrice);
            basketItems.push(itemObj);
        }
    }
    return basketItems;
}

//Return the number of items in basket currently
async function returnNumOfItemsInBasket(userID){
    return await Basket.find({"userID":userID}).count();
}

//Add all basket items into an invoice order
async function checkout(userID){
    let basket = await Basket.find({userID:userID});
    if(basket.length > 0){
        let items =[]; let amount=[];

        for(let i=0;i<basket.length;i++){
            items.push(basket[i].itemID);
            amount.push(basket[i].quantity);
            updateStockAmount(basket[i].itemID, basket[i].quantity);
            removeItemFromBasket(userID, basket[i].itemID);
        }

        let orderObj = {userID: userID, itemID: items,
        orderQuantity: amount, orderStatus:"Awaiting", dateOfOrder:new Date()};

        Order.collection.insertOne(orderObj, function(err){
            if(err){console.log(err);}
        });
    }
}

function updateStockAmount(itemID, substract){
    Book.collection.updateOne(
        {_id: mongoose.Types.ObjectId(itemID)},
        {$inc:{quantity:parseInt(parseInt(substract)*-1)}}
    );
}

//Save a chat message log
function logChat(sender,recipient,message,timeStamp){
    let chatObj = {sender: sender, recipient: recipient, message: message, timeStamp: timeStamp};
    Chat.collection.insertOne(chatObj, function(err, result){if(err){console.log(err);}});
}

//Return messages between two users
async function retrieveChatHistory(userID){
    let msgs = await Chat.find({$or:[{sender: userID, recipient:"admin"},{sender:"admin", recipient:userID}]}).sort({'timeStamp': -1});
    let msgArray = []; let msgObj;
    if(msgs.length > 0){
        let account = await Account.find({_id:mongoose.Types.ObjectId(userID)});
        let customerName = account[0].firstname + " " + account[0].lastname;
        for(let i=0;i<msgs.length;i++) {
            let timestamp = moment(msgs[i].timeStamp).utc().format('DD-MM-YYYY  h:mm a');
            if(msgs[i].sender === "admin"){
                msgObj = new ChatClass(msgs[i].sender, customerName, msgs[i].message, timestamp);
            }else{
                msgObj = new ChatClass(customerName, msgs[i].recipient, msgs[i].message, timestamp);
            }
            msgArray.push(msgObj);
        }
    }
    return msgArray;
}

//Get all orders as employee
async function getOrders(status){
    let order = await Order.find({"orderStatus":status}).sort({'dateOfOrder': -1});
    return await returnOrderObjects(order);
}

//Get all orders from one customer
async function getCustomerOrders(userID){
    let order = await Order.find({userID: userID}).sort({'dateOfOrder': -1});
    return await returnOrderObjects(order);
}

//Get selected order's details
async function getSelectedOrder(orderID){
    let order = await Order.find({_id:mongoose.Types.ObjectId(orderID)});
    let orderObj = null;

    if(order[0]._id !== undefined){
        let user = await Account.find({_id:mongoose.Types.ObjectId(order[0].userID)});
        let orderItems = await returnOrderItemsObjects(order[0].itemID, order[0].orderQuantity);
        //console.log("get selected order"+orderItems[0]);
        orderObj = new OrderClass(orderID, order[0].userID,
            user[0].firstname + " " + user[0].lastname, user[0].email,user[0].streetName, user[0].postCode,
            order[0].orderStatus,
            (moment(order[0].dateOfOrder).utc().format('DD-MM-YYYY hh:mm a')), orderItems
            );
    }

    return orderObj;
}

//Return an array of order objects
async function returnOrderObjects(order){
    let orderArray = [];
    if(order.length>0){
        for(let i=0;i<order.length;i++){
            //orderID, userID, userName, userEmail, street, postCode, orderStatus, orderDate, orderItems
            let user = await getAccount(mongoose.Types.ObjectId(order[i].userID));
            let fullname = user.getFirstName()+ " " + user.getSurname();
            let orderObj = new OrderClass(order[i]._id, order[i].userID,fullname,null,null,null,
                order[i].orderStatus,(moment(order[i].dateOfOrder).utc().format('DD-MM-YYYY hh:mm a')) , null);
            orderArray.push(orderObj);
        }
    }
    return orderArray;
}

//Return an array of order item objects
async function returnOrderItemsObjects(items, quantities){
    let orderItemObjArray = [];
    for(let i=0;i<items.length;i++){
        //Get price and name using id
        let item = await Book.find({_id:mongoose.Types.ObjectId(items[i])});
        //itemID, itemName, orderQuantity, totalItemPrice
        let orderItemObj = new OrderItemClass(items[i],item[0].bookName, quantities[i],(quantities[i]*item[0].sellingPrice));
        orderItemObjArray.push(orderItemObj);
    }
    return orderItemObjArray;
}

//Update order status from awaiting to delivered
function updateOrderStatus(orderID){
    Order.collection.updateOne(//Else update quantity
        {_id: mongoose.Types.ObjectId(orderID)},
        {$set:{orderStatus: "Delivered"}}
    );
}

module.exports.insertBook = insertBook;
module.exports.updateBook = updateBook;
module.exports.updateBookImage = updateBookImage;
module.exports.getAllBooks = getAllBooks;
module.exports.getOneBook = getOneBook;
module.exports.deleteBook = deleteBook;

module.exports.insertAccount = insertAccount;
module.exports.deleteAccount = deleteAccount;
module.exports.getLoginCredentials = getLoginCredentials;
module.exports.getAccount = getAccount;
module.exports.updateAccountDetails = updateAccountDetails;
module.exports.updatePassword = updatePassword;

module.exports.checkBasket = checkBasket;
module.exports.removeItemFromBasket = removeItemFromBasket;
module.exports.getAllItemsInBasket = getAllItemsInBasket;
module.exports.returnNumOfItemsInBasket = returnNumOfItemsInBasket;
module.exports.checkout = checkout;

module.exports.getListOfCustomers = getListOfCustomers;
module.exports.logChat = logChat;
module.exports.retrieveChatHistory = retrieveChatHistory;

module.exports.getOrders = getOrders;
module.exports.getCustomerOrders = getCustomerOrders;
module.exports.getSelectedOrder = getSelectedOrder;
module.exports.updateOrderStatus = updateOrderStatus;
