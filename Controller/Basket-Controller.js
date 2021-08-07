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
    db.removeItemFromBasket(userID, request.params.itemID);
    response.redirect("/View_Basket");
}

//Display items currently in basket
async function displayBasket(userID,response){
    let basket = await db.getAllItemsInBasket(userID);
    let account = await db.getAccount(userID);
    let basketNum = await db.returnNumOfItemsInBasket(userID);

    if(basket.length > 0){
        response.render("Basket",{"basket": basket, "account":account, "price":calculateTotalPrice(basket), "basketNum":basketNum});
    }else{
        response.render("Basket",{"basket": [], "account":account, "price":0.00, "basketNum":basketNum});
    }
}

//Checkout basket items
function checkout(userID, response){
    db.checkout(userID);
    response.redirect("/User_Home");
}

//Calculate total basket price
function calculateTotalPrice(basket){
    let price =0.00;
    for(let i=0;i<basket.length;i++){
        price = price + basket[i].getTotalPrice();
    }
    return price;
}

module.exports.checkBasket = checkBasket;
module.exports.removeItemFromBasket = removeItemFromBasket;
module.exports.displayBasket = displayBasket;
module.exports.checkout = checkout;