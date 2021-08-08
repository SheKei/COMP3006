$(function(){

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

    $(".name").keydown(function(){
        let ID = event.target.id;
        alphabetCharsOnly($("#"+ID).val().trim());
    });

    //Check if field left empty
    $(".name").keyup(function(){
        let ID = event.target.id;
        alphabetCharsOnly($("#"+ID).val().trim());
    });

    //Check if user is of 13 years age or older
    $("#dateOfBirth").change(function(){
        let dobInput = $("#dateOfBirth").val();
        dobInput = new Date(dobInput);

        let timeDifference = Date.now() - dobInput.getTime();
        let ageDifference = new Date(timeDifference);

        let age = Math.abs(ageDifference.getUTCFullYear() - 1970);
        if(age < 13){
            $("#message").html("You must be 13 years or older to register an account with us!");
            $("#registerBtn").attr("disabled", true);
        }else{
            $("#message").html("");
            $("#registerBtn").attr("disabled", false);
        }
    });

    //Check if field left empty
    $(".password").keyup(function(){
        comparePasswordInputs();
    });

    //Check if field left empty
    $(".password").keydown(function(){
        comparePasswordInputs();
    });


    function disableButtonIfEmpty(input){
        if(input === ""){
            $("#message").html("Please fill in all fields!");
            $("#registerBtn").attr("disabled", true);
        }else{
            $("#message").html("");
            $("#registerBtn").attr("disabled", false);
        }
    }

    function comparePasswordInputs(){
        let input1 = $("#password1").val();
        let input2 = $("#password2").val();
        if(input1 !== input2){
            $("#message").html("Passwords do not match!");
            $("#registerBtn").attr("disabled", true);
        }else{
            $("#message").html("");
            $("#registerBtn").attr("disabled", false);
        }
    }

    //Letters only for forename and surname
    function alphabetCharsOnly(input){
        let pattern = /[a-zA-z]/gi ;
        let valid = input.match(pattern);
        if(!valid){
            $("#message").html("Forename and surname should only contain letters!");
            $("#registerBtn").attr("disabled", true);
        }else{
            $("#message").html("");
            $("#registerBtn").attr("disabled", false);
        }
    }
});