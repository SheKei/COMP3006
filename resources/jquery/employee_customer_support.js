$(function(){
    let socket = io("http://localhost:9000");

    let user = "admin";
    let customer = "610580434665755c249b5b9e";

    $("#msg").keypress(function(){
        let message = $("#msg").val();
        if(message === ""){
            $('#sendMsgBtn').prop('disabled', true);
        }
        else{
            $('#sendMsgBtn').prop('disabled', false);
        }
    });


    //Add event handler
    $("#sendMsgBtn").click(function(){
        let message = $("#msg").val();

        if(message !== ""){
            let d = new Date();
            let month = d.getMonth() + 1;
            let date = d.getDate();
            if(date<10){date = "0"+date;}
            if(month<10){month="0"+month;}

            let timestamp = date + "/" + month + "/" + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes();

            socket.emit("send message", message, customer, user,new Date());
            $("#messages").prepend("<br><div class='adminDiv'><p>" + message + '<p><p class="font-weight-bold"> ' + timestamp + '</p></div><br><br><br><br><br>' );
            $("#msg").val("");
        }
    });

    socket.on("received message", function(msg, recipient, sender, timestamp){

        if(sender.trim() === customer.trim() && recipient.trim() === "admin"){
            $("#messages").prepend(
                "<div class='customerDiv'><p>" + msg + "</p>" +
                "<p class='font-weight-bold'>"+timestamp+"</p></div><br>");
        }

    });
});