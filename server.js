let express = require("express");
let http = require("http");
let path = require("path");
let socketIo = require("socket.io");
let session = require('express-session');
let bcrypt = require ('bcrypt');
let multer = require('multer');
let moment = require('moment');
moment().format();

//IMPORT ROUTES
let routes = require("./Routes");

//IMPORT CONTROLLERS
let bookController = require("./Controller/Book-Controller");
let accountController = require("./Controller/Account-Controller");
let basketController = require("./Controller/Basket-Controller");
let chatController = require("./Controller/Chat-Controller");

//CONFIGURE EXPRESS APP
let app = new express();
//CONFIGURE SERVER
let server = http.createServer(app);

//SOCKET.IO FUNCTIONALITY
let io = socketIo(server,{
    cors: {
        origin: "http://localhost:9000",
        methods: ["GET", "POST"]
    }
});

//CONFIGURE EXPRESS APP TO USE STATIC RESOURCES
app.use(express.static(path.join(__dirname, "resources")));

//SET APP UP TO USE EJS TEMPLATES
app.set("views", path.join(__dirname, "Public"));
app.set("view engine", "ejs");

//SET UP STATIC FILES
app.use(express.static(path.join(__dirname, "resources")));

//SET UP SESSION USAGE
let secretSesh = bcrypt.hashSync("secret", 10);
let sesh;
app.use(session({
    secret: secretSesh
}));

//FOR UPLOADING PICTURES
let storage = multer.diskStorage({
    destination: function(request, file, cb) {
        cb(null, './resources/images');//Image File Location
    },

    //Reattach file extension .jpg or .png
    filename: function(request, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage:storage });

//ENABLE PROCESSING OF POST FORMS
app.use(express.urlencoded({extended: true}));

//GET REQUESTS for ADMIN
app.get("/Add_Book", routes.loadAddBookPage);
app.get("/View_All_Stock", routes.loadViewAllStockPage);
app.get("/Employee_Customer_Support", routes.loadEmployeeChatRoom);
app.get("/Employee_Home", routes.loadViewOrdersPage);

//GET REQUEST TO VIEW STOCK BOOK
app.get("/View_Stock_Book/:bookId", routes.loadViewStockBookPage);

//GET REQUEST TO DELETE STOCK BOOK
app.get("/Delete_Book/:bookId", routes.deleteBook);

//GET REQUEST TO VIEW INVOICE ORDER
app.get("/View_Order_Employee/:orderId", routes.loadViewInovoiceOrderPage);

//GET REQUEST TO DELIVER CUSTOMER ORDER
app.get("/Process_Order/:orderId", routes.deliverOrder);

//GET REQUEST TO CHOOSE A CUSTOMER TO CONTACT
app.get("/Employee_Customer_Support/:userId", routes.loadEmployeeChosenChatRoom);

//FORM POST REQUEST TO ADD BOOK
app.post("/addBook", upload.single("imgCover"), (request, response) => {
    if(request.file) {bookController.addBook(request,response,request.file.filename);}
});

//FORM POST REQUEST to update cover image of existing book
app.post("/updateBookImg", upload.single("imgName"), (request, response) => {
    if(request.file) {bookController.updateBookImage(request,response,request.file.filename);}
});

//FORM POST REQUEST update book
app.post("/updateBook", bookController.updateBook);

//GET REQUESTS for USERS
app.get("/welcome", routes.loadWelcomePage);
app.get("/Login_or_Register", routes.loadLoginOrRegisterPage);
app.get("/User_Login", routes.loadUserLoginPage);
app.get("/User_Register", routes.loadUserRegisterPage);
app.get("/User_Home", routes.loadUserHomePage);
app.get("/View_Basket", routes.loadBasketPage);
app.get("/User_Account", routes.loadAccountPage);
app.get("/View_All_Books", routes.loadViewAllBookItemsPage);
app.get("/Contact_Shop", routes.loadCustomerSupportPage);
app.get("/Checkout_Basket", routes.checkoutBasket);

//FORM POST REQUEST register account
app.post("/registerAccount", accountController.createAccount);

//FORM POST REQUEST to view filtered books
app.post("/filterBooks", routes.loadFilteredBooksPage);

//FORM POST REQUEST to login
app.post("/checkLogin", accountController.login);

//FORM POST REQUEST to update account
app.post("/updateAccount", routes.updateAccount);

//FORM POST REQUEST to updatePassword
app.post("/updatePassword", routes.updatePassword);

//GET REQUESTS to view an order as customer
app.get("/View_Order_Customer/:orderId", routes.viewCustomerOrder);


let currentUser = "";
//GET REQUEST to save user id as session after successful login
app.get("/User_Home/:userID", function(request,response){
    sesh=request.session;
    sesh.user = request.params.userID;
    currentUser = sesh.user;
    response.redirect("/User_Home");
});

app.get("/LogOut", function(request,response){
    request.session.destroy();      //Erase session data
    response.redirect("/Welcome"); //Redirect to login page
});

//GET REQUEST to remove an item from basket
app.get("/removeBasket/:itemID",routes.removeItemFromBasket);

//GET REQUEST TO VIEW BOOK as customer
app.get("/View_Book/:bookId", routes.loadViewBookPage);

//GET REQUEST TO DELETE USER ACCOUNT
app.get("/Delete_Account", routes.deleteAccount);

//FORM POST REQUEST to add item to basket
app.post("/addToBasket", routes.addToBasket);

//GET REQUEST to notify user password update successful or not
app.get("/Password_Update/:success", routes.loadPasswordUpdateNotification);

//GET REQUEST to notify account details updated
app.get("/Account_Details_Updated", routes.loadAccountUpdateNotification);

//GET REQUEST to notify login error
app.get("/Login_Error", routes.loadLoginErrorNotification);

//GET REQUEST to notify registration success
app.get("/Reg_Success", routes.loadRegSuccessNotification);

//GET REQUEST to notify account reg failed due to email in use
app.get("/Email_Invalid", routes.loadEmailInvalidRegNotification);

app.get("/Account_Details_Update_Failed",routes.loadAccountUpdateFailedNotification);

//WEB SOCKET
io.on("connection", function(socket){

    //Wait for someone to send a message
    socket.on("send message", function(msg, recipient, sender, timestamp){
        //Log message
        chatController.logMessage(sender,recipient,msg,timestamp);

        //Emit by server to find which chatroom message should be sent to
        socket.broadcast.emit("received message" , msg, recipient, sender,
            moment(timestamp).utc().format('DD-MM-YYYY  h:mm a'));
    });

    socket.on("admin online", function(){
        //Emit by server to find which chatroom message should be sent to
        socket.broadcast.emit("update online status");
    });

});

//RUN THE SERVER ON PORT 9000
let port = 9000;

server.listen(port, function(){
    console.log("Listening on port:" + port);
});

module.exports.app = app;