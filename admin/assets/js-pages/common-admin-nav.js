
$(document).ready(function () {


    // set nav bar
    $(".header").load("common-admin-nav.html", function (response, status, xhr) {

        let storedName = localStorage.getItem("name");
        let role = localStorage.getItem("role");
        let email = localStorage.getItem("email");

        $('.user-name').text(storedName);
        $('.user-details').text(role);
        $('.profile-content-1').text(storedName);
        $('.dash-email').text(email);

        if (status === "error") {
            console.error("Error loading the navbar:", xhr.status, xhr.statusText);
        }
    });


    // set side bar
    $(".sidebar").load("common-admin-sidebar.html", function (response, status, xhr) {

        if (status === "error") {
            console.error("Error loading the sidebar:", xhr.status, xhr.statusText);
        }

    });



});