$(function(){

    $(".text").keydown(function(){
        let ID = event.target.id;
        if($("#"+ID).val().trim() === ""){
            $("#"+ID+"Msg").html("Please fill in all fields!");
        }
    });

    $(".text").keyup(function(){
        let ID = event.target.id;
        if($("#"+ID).val().trim() === ""){
            $("#"+ID+"Msg").html("Please fill in all fields!");
        }
    });
});