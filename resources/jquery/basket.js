$(function(){

    $(".fa-times-circle").click(function(){
        let itemID = event.target.id;
        itemID = itemID.trim();
        window.location.replace("/removeBasket/"+itemID);
    });
});