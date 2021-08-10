$(function(){
    //Find out which genres viewed booked is classed as
    let list = $("#genres").html();
    let array = list.split(",");

    for(let i=0; i<array.length; i++){
        if(array[i] === "short stories"){
            $('#shortStories').prop('checked', true);
        }else{
            $('#'+array[i]).prop('checked', true);
        }
    }

    //Check if field left empty
    $(".text").keydown(function(){
        let ID = event.target.id;
        disableButtonIfEmpty($("#"+ID).val().trim());
    });

    //Check if field left empty
    $(".text").keyup(function(){
        let ID = event.target.id;
        disableButtonIfEmpty($("#"+ID).val().trim());
    });

    //Check if name field only has letters
    $(".authorName").keydown(function(){
        let ID = event.target.id;
        alphabetCharsOnly($("#"+ID).val().trim());
    });

    //Check if name field only has letters
    $(".authorName").keyup(function(){
        let ID = event.target.id;
        alphabetCharsOnly($("#"+ID).val().trim());
    });

    //Check if at least one genre has been assigned to stock
    $(".genre").change(function(){
        checkIfMinOneGenreSelected();
    });

    //Check if selling price is less than stock price
    $(".price").change(function(){
        checkPrices();
    });

    function disableButtonIfEmpty(input){
        if(input === ""){
            $("#message").html("Please fill in all fields!");
            $("#saveEditBtn").attr("disabled", true);
        }else{
            getRidOfErrorMsg();
        }
    }

    //Letters only for forename and surname
    function alphabetCharsOnly(input){
        let pattern = /^[a-zA-Z\s]+$/gi ;
        let valid = input.match(pattern);
        if(!valid){
            $("#message").html("Forename and surname should only contain letters!");
            $("#saveEditBtn").attr("disabled", true);
        }else{
            getRidOfErrorMsg();
        }
    }

    //Erase error msg and enable button
    function getRidOfErrorMsg(){
        $("#message").html("");
        $("#saveEditBtn").attr("disabled", false);
    }

    function checkIfMinOneGenreSelected(){
        let boxIDs = ["#mystery", "#shortStories", "#comic", "#fantasy", "#horror",
            "#historical","#romance","#adventure","#scifi"];
        let atLeastOneGenre = false;

        for(let i=0;i<boxIDs.length;i++){
            if($(boxIDs[i]).is(':checked') === true){
                atLeastOneGenre = true;
                break;
            }
        }

        if(!atLeastOneGenre){
            $("#message").html("Please Select at Least one Genre to Assign to the Stock!");
            $("#saveEditBtn").attr("disabled", true);
        }else{
            getRidOfErrorMsg();
        }
    }

    function checkPrices(){

        if(!isNaN($("#sellPound").val()) && !isNaN($("#sellPenny").val()) && !isNaN($("#stockPound").val()) && !isNaN($("#stockPenny").val())){
            let sellingPrice = $("#sellPound").val() + "." + $("#sellPenny").val();
            sellingPrice = parseFloat(sellingPrice);

            let stockPrice = $("#stockPound").val() + "." + $("#stockPenny").val();
            stockPrice = parseFloat(stockPrice);

            if(sellingPrice <= stockPrice){
                $("#message").html("The Selling Price Cannot be Cheaper Than the Stock Price!");
                $("#saveEditBtn").attr("disabled", true);
            }else{
                getRidOfErrorMsg();
            }
        }
    }
});