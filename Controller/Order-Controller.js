let db = require("../database");
let session = require('express-session');
let mongoose = require("mongoose");

async function viewOrders(response){
    let orders = await db.getOrders();
    if(orders.length > 0){
        response.render("Employee_Home", {"orders":orders});
    }
}

module.exports.viewOrders = viewOrders;