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

    //Check if name field only has letters
    $(".name").keydown(function(){
        let ID = event.target.id;
        alphabetCharsOnly($("#"+ID).val().trim());
    });

    //Check if name field only has letters
    $(".name").keyup(function(){
        let ID = event.target.id;
        alphabetCharsOnly($("#"+ID).val().trim());
    });

    $(".address").keydown(function(){
        let ID = event.target.id;
        alphaNumChars($("#"+ID).val().trim());
    });

    //Check if field left empty
    $(".address").keyup(function(){
        let ID = event.target.id;
        alphaNumChars($("#"+ID).val().trim());
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
            $("#updateDetailsBtn").attr("disabled", true);
        }else{
            getRidOfErrorMsg();
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

    $("#newPassword").keydown(function(){
        checkPassword($("#newPassword").val().trim());
    });

    //Check if field left empty
    $("#newPassword").keyup(function(){
        checkPassword($("#newPassword").val().trim());
    });


    function disableButtonIfEmpty(input){
        if(input === ""){
            $("#message").html("Please fill in all fields!");
            $("#updateDetailsBtn").attr("disabled", true);
        }else{
            getRidOfErrorMsg();
        }
    }

    function comparePasswordInputs(){
        let input1 = $("#newPassword").val();
        let input2 = $("#confirmPassword").val();
        if(input1 !== input2){
            $("#passwordMessage").html("Passwords do not match!");
            $("#updatePasswordBtn").attr("disabled", true);
        }else{
            getRidOfErrorMsg();
        }
    }

    //Letters only for forename and surname
    function alphabetCharsOnly(input){
        let pattern = /^[a-zA-Z0-9\s]+$/gi ;
        let valid = input.match(pattern);
        if(!valid){
            $("#message").html("Forename and surname should only contain letters!");
            $("#updateDetailsBtn").attr("disabled", true);
        }else{
            getRidOfErrorMsg();
        }
    }

    function alphaNumChars(input){
        let pattern = /^[a-zA-Z0-9\s]+$/gi ;
        let valid = input.match(pattern);
        if(!valid){
            $("#message").html("Address should only contain letters and numbers only!");
            $("#updateDetailsBtn").attr("disabled", true);
        }else{
            getRidOfErrorMsg();
        }
    }

    //Erase error msg and enable button
    function getRidOfErrorMsg(){
        $("#message").html("");
        $("#updateDetailsBtn").attr("disabled", false);
    }

    function checkPassword(input){
        let specialCharPattern = /[^\w\s]/g ;
        let lowerCasePattern = /[a-z]/g ;
        let upperCasePattern = /[A-Z]/g  ;
        let numericPattern = /[0-9]/g;
        let passwordValid = false;


        if(input.match(specialCharPattern)){
            passwordValid = true;
            $("#special").css('color', 'green');
            $("#special").removeClass("fa-times");
            $("#special").addClass("fa-check");
        }else{
            passwordValid = false;
            $("#special").css('color', 'red');
            $("#special").removeClass("fa-check");
            $("#special").addClass("fa-times");
        }

        if(input.match(lowerCasePattern)){
            passwordValid = true;
            $("#lower").css('color', 'green');
            $("#lower").removeClass("fa-times");
            $("#lower").addClass("fa-check");
        }else{
            passwordValid = false;
            $("#lower").css('color', 'red');
            $("#lower").removeClass("fa-check");
            $("#lower").addClass("fa-times");
        }

        if(input.match(upperCasePattern)){
            passwordValid = true;
            $("#upper").css('color', 'green');
            $("#upper").removeClass("fa-times");
            $("#upper").addClass("fa-check");

        }else{
            passwordValid = false;
            $("#upper").css('color', 'red');
            $("#upper").removeClass("fa-check");
            $("#upper").addClass("fa-times");
        }

        if(input.match(numericPattern)){
            passwordValid = true;
            $("#digit").css('color', 'green');
            $("#digit").removeClass("fa-times");
            $("#digit").addClass("fa-check");
        }else{
            passwordValid = false;
            $("#digit").css('color', 'red');
            $("#digit").removeClass("fa-check");
            $("#digit").addClass("fa-times");
        }

        if(input.length >= 8){
            passwordValid = true;
            $("#length").css('color', 'green');
            $("#length").removeClass("fa-times");
            $("#length").addClass("fa-check");
        }else{
            passwordValid = false;
            $("#length").css('color', 'red');
            $("#length").removeClass("fa-check");
            $("#length").addClass("fa-times");
        }

        if(!passwordValid){
            $("#updatePasswordBtn").attr("disabled", true);
        }else{
            $("#updatePasswordBtn").attr("disabled", false);
        }
    }

});