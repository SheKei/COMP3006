class Order{

    constructor(orderID, userID, userFullname, street, postCode, orderStatus, orderDate, orderItems) {
        this._orderID = orderID;
        this._userID = userID;
        this._userFullname = userFullname;
        this._street = street;
        this._postCode = postCode;
        this._orderStatus = orderStatus;
        this._orderDate = orderDate;
        this._orderItems = orderItems;
    }

    getOrderID() {
        return this._orderID;
    }

    getUserID() {
        return this._userID;
    }

    getUserFullname(){
        return this._userFullname;
    }

    getStreet() {
        return this._street;
    }

    getPostCode() {
        return this._postCode;
    }

    getOrderStatus() {
        return this._orderStatus;
    }

    getOrderDate() {
        return this._orderDate;
    }

    getOrderItems() {
        return this._orderItems;
    }
}

module.exports = Order;