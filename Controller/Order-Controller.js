let db = require("../database");
let session = require('express-session');
let mongoose = require("mongoose");

//View all orders as employees
async function viewOrders(response){
    let orders = await db.getOrders();
    if(orders.length > 0){
        response.render("Employee_Home", {"orders":orders});
    }
}

//View all orders made by the customer
async function viewCustomerOrders(userID,response){
    let orders = await db.getCustomerOrders(userID);
    if(orders.length > 0){
        response.render("User_Home", {"orders":orders});
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