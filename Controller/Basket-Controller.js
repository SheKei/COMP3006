let db = require("../database");
let session = require('express-session');
let mongoose = require("mongoose");

//Add or update quantity item to basket
function checkBasket(userID,response, request){
    db.checkBasket(userID, request.body.bookID, request.body.orderAmount);
    response.redirect("/View_Book/"+request.body.bookID);
}

//Remove an item from basket
function removeItemFromBasket(userID, request,response){
    console.log("userid is " + request.session.user);
    console.log("itemid is " + request.params.itemID);
    db.removeItemFromBasket(userID, request.params.itemID);
    response.redirect("/View_Basket");
}

//Display items currently in basket
async function displayBasket(userID,response){
    let basket = await db.getAllItemsInBasket(userID);
    if(basket.length > 0){
        console.log("length > 0");
        response.render("Basket",{"basket": basket});
    }else{
        console.log("length = 0");
        response.render("Basket",{"basket": []});
    }
}

module.exports.checkBasket = checkBasket;
module.exports.removeItemFromBasket = removeItemFromBasket;
module.exports.displayBasket = displayBasket;