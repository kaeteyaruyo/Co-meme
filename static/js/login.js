$(document).ready(function () {
    // submit login form
    $('#login__form button[type="submit"]').click((event) => {
        event.preventDefault()
        $.get('./login/submit', {
            account: $('#login__form input[name=account]').val(),
            password: $('#login__form input[name=password]').val(),
        }, (data, status) => {
            alert("Data:"+ data + "\nStatus:" + status);
        })
    })
});