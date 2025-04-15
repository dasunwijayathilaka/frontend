$(document).ready(function () {

    localStorage.clear();

    $("form").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        let name = $("input[placeholder='Name']").val().trim();
        let email = $("input[placeholder='Email Address']").val().trim();
        let password = $("input[placeholder='Password']").val().trim();
        let phone = $("input[placeholder='Phone number']").val().trim();
        let role = "USER";
        let image = null;

        // Validation checks
        if (name === "") {
            alert("Name is required");
            return;
        }

        if (email === "" || !validateEmail(email)) {
            alert("Enter a valid email address");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Enter a valid 10-digit phone number");
            return;
        }

        // Prepare user data
        let userData = { name, email, password, phone, role };

        let formData = new FormData();
        formData.append("userDTO", new Blob([JSON.stringify(userData)], { type: "application/json" }));

        // ✅ Append image only if it exists
        if (image) {
            formData.append("image", image);
        }

        // Send AJAX request
        $.ajax({
            url: "http://localhost:8082/api/v1/user/register",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.code === 201) {
                    Swal.fire({
                        title: "Success!",
                        text: "Registration Successful",
                        icon: "success",
                        timer: 1000,
                        background: '#fff',
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "login.html";
                    });
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function (xhr) {
                console.log(xhr);
                alert("Error: " + (xhr.responseJSON?.message || xhr.statusText));
            }
        });
    });

    // Email validation function
    function validateEmail(email) {
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

});
