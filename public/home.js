/*global $*/
window.onload = function() {
    var url = window.location.toString();
    document.getElementById("basic-addon3 site").textContent = url;
}

function requestShrt() {
    $("#response-alert").removeClass('alert-danger');
    $("#response-alert").removeClass('alert-success');
    var long = $('#long-url').val();
    var short = $('#basic-url').val();
    if (!long) {
        $("#response-alert").addClass('alert-danger');
        $("#response").text('Please provide a url');
    }
    else {
        var url;
        if (short) {
            url = window.location.toString() + 'newCustom/' + short + '/old/' + long;
        }
        else {
            url = window.location.toString() + 'new/' + long;
        }
        console.log(url);
        $.ajax({
            url: url,
            success: function(result) {
                if (result.error) {
                    $("#response").text(result.error);
                    $("#response-alert").addClass('alert-danger');
                    if (result.error.indexOf('already taken.') != -1) {
                        $("#basic-url").val("");
                    }
                    if (result.error.indexOf("Invalid URL") != -1) {
                        $('#long-url').val("");
                    }
                }
                else {
                    $("#response").text('The new short ' + result.short + ' redirects to ' + result.original);
                    $("#response-alert").addClass('alert-success');
                    $("#long-url").val("");
                    $("#basic-url").val("");
                }
            }
        });
    }
}
