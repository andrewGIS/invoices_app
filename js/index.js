function main_function() {
    load_data();
}
function load_data() {
    $("#test22").css("border", "3px solid red");
    $("#test").text(params().name);
    $.ajax({
            url: "https://invoices-app-andrew.herokuapp.com/invoices",
            dataType:"json"
    })
    .done(function(data){
        $("#data").text = data.to
    });
}
function params() {
    return {
        name: "andrew"
    }
}