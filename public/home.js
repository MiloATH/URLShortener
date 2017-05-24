/*global $*/
window.onload = function() {
    var url = window.location.origin.toString();
    document.getElementById("basic-addon3 site").textContent = url + '/';
};

function requestShrt() {
    $(".short-url").text("");
    $("#response-alert").removeClass('alert-danger');
    $("#response-alert").removeClass('alert-success');
    $(".loader").css({
        "display": "inline-block"
    });
    $("#response").text("");
    var long = $('#long-url').val();
    var short = $('#basic-url').val();
    if (!long) {
        $(".loader").css({
            "display": "none"
        });
        $("#response-alert").addClass('alert-danger');
        $("#response").text('Please provide a url');
    } else {
        //Check for http or https in url
        var httpTest = /^((http|https):\/\/)/;
        if (!httpTest.test(long)) {
            long = "http://" + long;
        }
        if (short) {
            url = window.location.origin.toString() + '/newCustom/' + short + '/old/' + long;
        } else {
            url = window.location.origin.toString() + '/new/' + long;
        }
        $.ajax({
            url: url,
            success: function(result) {
                $(".loader").css({
                    "display": "none"
                });
                if (result.error) {
                    $("#response").text(result.error);
                    $("#response-alert").addClass('alert-danger');
                    if (result.error.indexOf('already taken.') != -1) {
                        $("#basic-url").val("");
                    }
                    if (result.error.indexOf("Invalid URL") != -1) {
                        $('#long-url').val("");
                    }
                } else {
                    var shortURL = result.short;
                    $("#response").text('The new short ' + shortURL + ' redirects to ' + result.original);
                    $(".short-url").attr('href', shortURL).text(shortURL);
                    $("#response-alert").addClass('alert-success');
                    $("#long-url").val("");
                    $("#basic-url").val("");
                }
            }
        });
    }
}

$(document).keypress(function(e) {
    if (e.which == 13) {
        requestShrt();
    }
});
