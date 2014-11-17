"use strict";

$(document).ready(function() {

    function handleError(message) {
        $("#errorMessage").text(message);
        $("#domoMessage").animate({width:'toggle'},350);
    }
    
    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                $("#domoMessage").animate({width:'hide'},350);

                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
            }
        });        
    }
    
    $("#makeGraveSubmit").on("click", function(e) {
        e.preventDefault();
    
        $("#domoMessage").animate({width:'hide'},350);
    
        if($("#serverName").val() == '' || $("#serverPackets").val() == '') {
            handleError("All fields are required");
            return false;
        }

        sendAjax($("#graveForm").attr("action"), $("#graveForm").serialize());
        
        return false;
    });
    
});