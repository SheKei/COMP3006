$(function(){

    //Show orders with delivered status
    $("#deliveredBtn").click(function(){
        $("#awaitingOrdersDiv").addClass("hidden");
        $("#deliveredOrdersDiv").removeClass("hidden");
        clickedButton("#deliveredBtn", "#awaitingBtn");
    });

    //Show orders with awaiting status
    $("#awaitingBtn").click(function(){
        $("#deliveredOrdersDiv").addClass("hidden");
        $("#awaitingOrdersDiv").removeClass("hidden");
        clickedButton("#awaitingBtn", "#deliveredBtn");
    });

    //Highlight which button was clicked
    function clickedButton(btn1, btn2){
        $(btn1).addClass('btn-secondary');
        $(btn1).removeClass('btn-dark');
        $(btn2).addClass('btn-dark');
        $(btn2).removeClass('btn-secondary');
    }
});