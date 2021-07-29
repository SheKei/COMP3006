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
});