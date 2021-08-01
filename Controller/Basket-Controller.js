let db = require("../database");
let session = require('express-session');
let mongoose = require("mongoose");

//Add or update quantity item to basket
function checkBasket(userID,response, request){
    db.checkBasket(userID, request.body.bookID, request.body.orderAmount);
    response.redirect("/View_Book/"+request.body.bookID);
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
module.exports.displayBasket = displayBasket;