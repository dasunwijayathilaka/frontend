$(document).ready(function() {

    localStorage.clear();

    $(".btn-login").click(function(event) {
        event.preventDefault(); // Prevent default form submission

        let email = $("input[type='text']").val();
        let password = $("input[type='password']").val();

        if (email === "" || password === "") {
            Swal.fire({
                title: "Error!",
                text: "Please enter email and password",
                icon: "error",
                background: '#ffffff',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        let userDTO = {
            email: email,
            password: password
        };

        $.ajax({
            url: "http://localhost:8082/api/v1/auth/login", // Adjust this URL based on your backend
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(userDTO),
            dataType: "json",
            success: function(response) {
                if (response.code === 200) {

                    let token = response.data.token;
                    let role = response.data.role;
                    let name = response.data.name;
                    let id = response.data.id;
                    let email = response.data.email;

                    console.log("User Details:", { name, role, token, id, email });

                    // Store token & role in local storage
                    localStorage.setItem("token", token);
                    localStorage.setItem("role", role);
                    localStorage.setItem("name", name);
                    localStorage.setItem("loggedInUserId", id);
                    localStorage.setItem("email", email);

                    let redirectURL = role === "ADMIN" ? "index.html" : "http://localhost:63342/AAD-FRONTEND/html/home.html";

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
                    Swal.fire({
                        title: "Error!",
                        text: "Invalid email or password",
                        icon: "error",
                        background: '#ffffff',
                        confirmButtonColor: '#d33'
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error: ", error);
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred while logging in",
                    icon: "error",
                    background: '#ffffff',
                    confirmButtonColor: '#d33'
                });
            }
        });
    });
});
