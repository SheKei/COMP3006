let db = require("../database");
let session = require('express-session');
let mongoose = require("mongoose");

async function viewOrders(response){
    let orders = await db.getOrders();
    if(orders.length > 0){
        response.render("Employee_Home", {"orders":orders});
    }
}

async function viewOrderEmployee(orderID, response){
    let order = await db.getSelectedOrder(orderID);
    if(order !== null){
        let orderItems = order.getOrderItems();
        console.log("view order control "+ orderItems[0]);
        response.render("View_Order_Employee",{
            "order":order,
            "orderItems": orderItems
        });
    }
}

module.exports.viewOrders = viewOrders;
module.exports.viewOrderEmployee = viewOrderEmployee;