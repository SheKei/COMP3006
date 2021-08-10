let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let session = require("express-session");
chai.use(chaiHttp);

suite("Integration test for welcome page", function() {
    test("Test GET /welcome", function() {
        let app = server.app;
        chai.request(app).get("/welcome").end(function(error, response) {
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /Login_or_Register", function(){
        let app = server.app;
        chai.request(app).get("/Login_or_Register").end(function(error,response){
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });
});

suite("Integration Test For Register & Login Page", function() {
    test("Test GET /User_Register", function() {
        let app = server.app;
        chai.request(app).get("/User_Register").end(function(error, response) {
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /Email_Invalid Notification", function(){
        let app = server.app;
        chai.request(app).get("/Email_Invalid").end(function(error,response){
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /Reg_Success Notification", function(){
        let app = server.app;
        chai.request(app).get("/Reg_Success").end(function(error,response){
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /Login_Error Notification", function(){
        let app = server.app;
        chai.request(app).get("/Login_Error").end(function(error,response){
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /User_Login", function(){
        let app = server.app;
        chai.request(app).get("/User_Login").end(function(error,response){
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });
});

suite("Integration Test For Customer Pages", function() {

    test("Test GET /User_Home/:userID", function() {
        let app = server.app;
        let userID = "610580434665755c249b5b9e";

        chai.request(app).get("/User_Home/"+userID).end(function(error, response, request) {
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.equal(request.session.user, "610580434665755c249b5b9e", "Should be the same ID");
        });
    });

    test("Test GET /User_Home", function(){
        let app = server.app;
        chai.request(app).get("/User_Home").end(function(error,response,request){
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.equal(request.session.user, "610580434665755c249b5b9e", "Should be the same ID");
        });
    });

    test("Test GET /View_Basket", function(){
        let app = server.app;
        chai.request(app).get("/View_Basket").end(function(error,response, request){
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.equal(request.session.user, "610580434665755c249b5b9e", "Should be the same ID");
        });
    });

    test("Test GET /User_Account", function(){
        let app = server.app;
        chai.request(app).get("/User_Account").end(function(error,response, request){
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.equal(request.session.user, "610580434665755c249b5b9e", "Should be the same ID");
        });
    });

    test("Test GET /Contact_Shop", function(){
        let app = server.app;
        chai.request(app).get("/Contact_Shop").end(function(error,response, request){
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.equal(request.session.user, "610580434665755c249b5b9e", "Should be the same ID");
        });
    });

    test("Test GET /LogOut", function(){
        let app = server.app;
        chai.request(app).get("/LogOut").end(function(error,response, request){
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.isNull(request.session.user, "Should be null");
        });
    });

});

suite("Integration Test For Adding and Viewing Book", function() {

    test("Test GET /View_All_Stock", function() {
        let app = server.app;
        chai.request(app).get("/View_All_Stock").end(function(error, response) {
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /View_Stock_Book/:bookId", function(){
        let app = server.app;
        let bookID = "6102c14551afa35e78772484";

        chai.request(app).get("/View_Stock_Book/"+bookID).end(function(error,response, request){
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.equal(request.params.bookId,"6102c14551afa35e78772484", "Should be same ID");
        });
    });

    test("Test GET /View_Book/:bookId", function(){
        let app = server.app;
        let bookID = "6102c14551afa35e78772484";

        chai.request(app).get("/View_Book/"+bookID).end(function(error,response, request){
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.equal(request.params.bookId,"6102c14551afa35e78772484", "Should be same ID");
        });
    });

    test("Test GET /View_All_Books", function() {
        let app = server.app;
        chai.request(app).get("/View_All_Books").end(function(error, response) {
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

});

suite("Integration Test For Admin Pages", function() {
    test("Test GET /Add_Book", function() {
        let app = server.app;
        chai.request(app).get("/Add_Book").end(function(error, response) {
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /Employee_Customer_Support", function(){
        let app = server.app;
        chai.request(app).get("/Employee_Customer_Support").end(function(error,response){
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /Employee_Home", function(){
        let app = server.app;
        chai.request(app).get("/Employee_Home").end(function(error,response){
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /Employee_Customer_Support/:userId", function(){
        let app = server.app;
        let userID = "610580434665755c249b5b9e";
        chai.request(app).get("/Employee_Customer_Support/"+userID).end(function(error,response,request){
            chai.assert.equal(response.status, 200, "Wrong status code");
            chai.assert.equal(request.params.userId, "610580434665755c249b5b9e", "Should be same");
        });
    });
});

suite("Integration test for viewing orders as customer or admin", function() {
    test("Test GET /welcome", function() {
        let app = server.app;
        chai.request(app).get("/welcome").end(function(error, response) {
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });

    test("Test GET /Login_or_Register", function(){
        let app = server.app;
        chai.request(app).get("/Login_or_Register").end(function(error,response){
            chai.assert.equal(response.status, 200, "Wrong status code");
        });
    });
});