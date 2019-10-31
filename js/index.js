var server = "https://invoices-app-andrew.herokuapp.com";
//var server = "http://localhost:3000";
var selected_field = "";
var selected_direction = "asc";
var selected_text = "";
var selected_filter = "";

function return_html_present(invoice) {

    return "<tr>" +
        // "<th>" + invoice.id + "</th>" +
        // "<td>" + invoice.direction + "</td>" +
        // "<td>" + invoice.number + "</td>" +
        "<td>" + invoice.date_created + "</td>" +
        "<td>" + invoice.number + "</td>" +
        "<td>" + invoice.date_supply + "</td>" +
        "<td>" + invoice.comment + "</td>" +
        "<td><button delete_id=" + invoice.id +
        " type='button' style='margin-right:2px;' class='btn btn-danger btn-xs delete_button' onclick='delete_invoice(this)'>Delete</button>" +
        "<button edit_id=" + invoice.id +
        " class='btn btn-warning btn-xs edit_button' onclick='edit_invoice(this)'>Edit</button></td>" +
        "</tr>"
}

$(document).ready(main_function);

function main_function() {

    $(".select_direction").hide();

    $('#datetimepicker_create').datetimepicker({
        format: 'DD.MM.YYYY',
        locale: 'ru'
    });

    $('#datetimepicker_supply').datetimepicker({
        format: 'DD.MM.YYYY',
        locale: 'ru'
    });

    $('.select_field').change(change_sorting);
    $('.select_direction').change(change_sorting);

    $('.select_filter').change(change_filter);

    $(".search_text").on("keyup", run_find);

    $(".save_button").on("click", {
        edit: false
    }, save_invoice);

    load_data();
}


//load_data();

function load_data() {

    var add_params = "";


    if (selected_text && !selected_filter) {
        add_params += ("&q=" + selected_text);
    }

    if (selected_field && selected_direction) {
        add_params +=
            ("&_sort=" + selected_field +
                "&_order=" + selected_direction)
    }

    if (selected_filter) {
        add_params += ("&" + selected_filter + "_like=" + selected_text)
    }

    fetch(server + "/invoices/?" + add_params)
        .catch(function (error) {
            alert(error);
            $("tbody").text(error);
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            $("tbody").empty();
            $.each(data, function (index, invoice) {
                $("tbody").append(return_html_present(invoice))
            })
        })

    $("tbody").text("Загрузка...");

}

function save_invoice(event) {

    $('#myModal').modal("toggle");

    let input_values = $(".input_modal")

    let request_type;
    let url_path;

    let post_json = {
        id: event.data.id_value,
        date_created: input_values[0].value,
        number: parseInt(input_values[1].value),
        date_supply: input_values[2].value,
        comment: input_values[3].value
    }

    if (event.data.edit) {

        request_type = "PUT";
        url_path = server + "/invoices/" + event.data.id_value;

        $(".save_button").off();
        $(".save_button").on("click", {
            edit: false,
            id_value: create_GUID()
        }, save_invoice)

        clear_input();
    }
    else {

        request_type = "POST";
        url_path = server + "/invoices";

        clear_input();
    }

    fetch(url_path, {
        method: request_type,
        body: JSON.stringify(post_json),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .catch(function (error) {
            alert("Ошибка при добавлении записи!");
        })
        .then(load_data);


}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function create_GUID() {
    // then to call it, plus stitch in '4' in the third group
    guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid
}

function delete_invoice(clicked_button) {
    let delete_id = clicked_button.attributes.delete_id.value;

    fetch(server + "/invoices/" + delete_id, {
        method: "DELETE",
    })
        .catch(function (error) {
            alert("Ошибка при удалении!");
            //load_data();
        })
        .then(load_data);
}

function edit_invoice(clicked_button) {

    let edit_id = clicked_button.attributes.edit_id.value;

    let input_values = $(".input_modal");

    fetch(server + "/invoices/" + edit_id).then(function (response) {
        return response.json();
    }).then(function (data) {
        $(input_values[0]).val(data.date_created)
        $(input_values[1]).val(data.number)
        $(input_values[2]).val(data.date_supply)
        $(input_values[3]).val(data.comment)
    });

    $('#myModal').modal('show');

    $(".save_button").off();
    $(".save_button").on("click", {
        id_value: edit_id,
        edit: true
    }, save_invoice)
}
function clear_input() {

    let input_values = $(".input_modal")

    $('#datetimepicker_create').data("DateTimePicker").clear();
    $('#datetimepicker_supply').data("DateTimePicker").clear();
    $(input_values[1]).val("") //
    $(input_values[2]).val("") //
    $(input_values[3]).val("") //
}
function run_find() {
    selected_text = this.value;
    load_data();
}
function change_sorting() {

    selected_field = $(".select_field")[0].value;

    if (selected_field) {

        $(".select_direction").show();
        selected_direction = $(".select_direction")[0].value;

    }
    else {
        $(".select_direction").hide();
    }

    load_data();

}
function change_filter() {
    selected_filter = this.value;
    load_data();
}