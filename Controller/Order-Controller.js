let db = require("../Database");
let session = require('express-session');
let mongoose = require("mongoose");

//View all orders as employees
async function viewOrders(response){
    let awaitingOrders = await db.getOrders("Awaiting");
    let deliveredOrders = await db.getOrders("Delivered");
    response.render("Employee_Home", {"awaitingOrders":awaitingOrders,"deliveredOrders":deliveredOrders});

}

//View all orders made by the customer
async function viewCustomerOrders(userID,response){
    let orders = await db.getCustomerOrders(userID);
    let basketNum = await db.returnNumOfItemsInBasket(userID);
    if(orders.length > 0){
        response.render("User_Home", {"orders":orders,"basketNum":parseInt(basketNum)});
    }else{
        response.render("User_Home", {"orders":"","basketNum":basketNum});
    }
}

//View an order as employee
async function viewOrderEmployee(orderID, response){
    let order = await db.getSelectedOrder(orderID);
    if(order !== null){
        let orderItems = order.getOrderItems();
        response.render("View_Order_Employee",{
            "order":order,
            "orderItems": orderItems,
            "orderPrice": calculateTotalOrder(orderItems)
        });
    }
}

//View an order as customer
async function viewOrderCustomer(userID,orderID, response){
    let order = await db.getSelectedOrder(orderID);
    let basketNum = await db.returnNumOfItemsInBasket(userID);
    if(order !== null){
        let orderItems = order.getOrderItems();
        response.render("View_Order_User",{
            "order":order,
            "orderItems": orderItems,
            "orderPrice": calculateTotalOrder(orderItems),
            "basketNum": basketNum
        });
    }
}

//Mark an order as delivered
function deliverOrder(orderID, response){
    db.updateOrderStatus(orderID);
    response.redirect("/View_Order_Employee/"+orderID);
}

function calculateTotalOrder(items){
    let price = 0.00;
    for(let i=0;i<items.length;i++){
        price = price+ items[i].getTotalItemPrice();
    }
    return price;
}

module.exports.viewOrders = viewOrders;
module.exports.viewOrderEmployee = viewOrderEmployee;
module.exports.deliverOrder = deliverOrder;
module.exports.viewCustomerOrders = viewCustomerOrders;
module.exports.viewOrderCustomer = viewOrderCustomer;