let mongoose = require("mongoose");

//CONNECT TO DATABASE
let dbUrl = "mongodb://localhost:27017/bookstoredb";
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true});

//IMPORT SCHEMAS
let Account = require("./Schema/Account-Schema").Account;
let Book = require("./Schema/Book-Schema").Book;
let Basket = require('./Schema/Basket-Schema').Basket;
let Chat = require("./Schema/Chat-Schema").Chat;

//IMPORT MODEL CLASSES
let BookClass = require("./Model/Book");
let Credentials = require("./Model/Credentials");
let AccountClass = require("./Model/Account");
let BasketClass = require('./Model/Basket');

//PROCEDURES

//Create a new book item after stock form submission
function insertBook(authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres, image){
    let bookObj = {authorForename:authorForename, authorSurname: authorSurname, bookName:bookName, stockPrice:stockPrice, sellingPrice:sellingPrice, stockAmount:stockAmount, synopsis:synopsis, genres: genres, image:image};
    Book.collection.insertOne(bookObj, function(err){
        if(err){console.log(err);}
    });
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

//Create a new account upon registration
function insertAccount(firstname, lastname, birthday, email, streetName,postCode,password){
    let accountObj = {firstname: firstname, lastname: lastname, birthday:birthday, email:email, streetName:streetName, postCode:postCode, password:password};
    Account.collection.insertOne(accountObj, function(err){
       if(err){console.log(err);}
    });
}

//Get all account details for display
async function getAccount(userID){
    let account = await Account.find({_id: Mongoose.Types.ObjectId(userID)});
    let accountObj = null;
    if(account[0] !== undefined){
        accountObj = new AccountClass(_id, account[0].firstname, account[0].lastname,
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

//Save a chat message log
function logChat(sender,recipient,message,timeStamp){
    let chatObj = {sender: sender, recipient: recipient, message: message, timeStamp: timeStamp};
    Chat.collection.insertOne(chatObj, function(err, result){if(err){console.log(err);}});
}

module.exports.insertBook = insertBook;
module.exports.updateBook = updateBook;
module.exports.updateBookImage = updateBookImage;
module.exports.getAllBooks = getAllBooks;
module.exports.getOneBook = getOneBook;

module.exports.insertAccount = insertAccount;
module.exports.getLoginCredentials = getLoginCredentials;

module.exports.checkBasket = checkBasket;
module.exports.removeItemFromBasket = removeItemFromBasket;
module.exports.getAllItemsInBasket = getAllItemsInBasket;

module.exports.logChat = logChat;
