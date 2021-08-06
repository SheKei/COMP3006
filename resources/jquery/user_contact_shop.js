$(function(){
    let socket = io("http://localhost:9000");
    let employee = "admin";
    let user = $("#userID").html();
    user = user.trim();

    $("#msg").keypress(function(){
        let message = $("#msg").val();
        if(message === ""){ //Disable button if user tries to send empty string
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

            socket.emit("send message", message.trim(), employee.trim(), user.trim(),new Date());
            $("#messages").prepend("<br><div class='customerDiv'><p>" + message + '<p><p class="font-weight-bold"> ' + timestamp + '</p></div><br>');
        }
    });

    socket.on("received message", function(msg, recipient, sender, timestamp){
        if(sender.trim() === "admin" && recipient.trim() === user.trim()){
            $("#messages").prepend(
                "<div class='adminDiv'><p>Admin: " + msg + "</p>" +
                "<p class='font-weight-bold'>"+timestamp+"</p></div><br><br><br><br><br><br><br>");
        }

    });
});