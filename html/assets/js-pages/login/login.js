$(document).ready(function () {

    localStorage.clear();

    $(".login-btn").click(function (e) {
        e.preventDefault(); // Prevent default form submission

        let email = $(".form-control[placeholder='Email Address']").val().trim();
        let password = $(".form-control.pass-input").val().trim();

        if (email === "" || password === "") {
            Swal.fire("Error", "Please enter both email and password", "error");
            return;
        }

        $.ajax({
            url: "http://localhost:8082/api/v1/auth/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email: email, password: password }),
            success: function (response) {
                if (response.code === 200) {
                    let token = response.data.token;
                    let role = response.data.role;
                    let name = response.data.name;
                    let id = response.data.id;
                    let userImage = response.data.userImage;


                    console.log(name);
                    console.log(role);
                    console.log(token);
                    console.log(id);
                    console.log("userImage: " + userImage);

                    // Store token & role in local storage
                    localStorage.setItem("token", token);
                    localStorage.setItem("role", role);
                    localStorage.setItem("name", name);
                    localStorage.setItem("loggedInUserId", id);
                    localStorage.setItem("userImage", userImage);


                    let redirectURL = role === "ADMIN" ? "../admin/index.html" : "home.html";

                    Swal.fire({
                        title: "Success!",

                        text: "Login Successful",
                        icon: "success",
                        timer: 2000,
                        background: '#ffffff',
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = redirectURL;
                    });
                } else {
                    Swal.fire("Login Failed", response.message, "error");
                }
            },
            error: function (xhr) {
                Swal.fire("Error", xhr.responseJSON?.message || "Something went wrong!", "error");
            }
        });
    });
});