const isLoggedIn = localStorage.getItem("loggedInUserId"); // Change this based on your authentication system


if (isLoggedIn) {
    $("#navbar-placeholder").load("logged-navbar.html", function (response, status, xhr) {

        let storedName = localStorage.getItem("name");

        loadProfilePhoto();

        if (storedName) {
            $("#logged-person-name").text(storedName); // ✅ Replace text inside span with class 'user-name'
        }

        if (status === "error") {
            console.error("Error loading the navbar:", xhr.status, xhr.statusText);
        }

    });
} else {
    $("#navbar-placeholder").load("non-user-nav.html", function (response, status, xhr) {

        if (status === "error") {
            console.error("Error loading the navbar:", xhr.status, xhr.statusText);
        }

    });
    // window.location.href = "login.html";
}



// Set user image to navbar
function loadProfilePhoto() {
    const userId = localStorage.getItem("loggedInUserId");

    $.ajax({
        url: `http://localhost:8082/api/v1/user/${userId}`,
        type: 'GET',
        success: function(response) {
            console.log("Profile response:", response); // Debug the response structure

            // Check if response has data property or is directly the user object
            const userData = response.data || response;

            if (userData && userData.userImage) {
                // Update the image in navbar
                $('#profileImage').attr('src', userData.userImage);

                // Also store in localStorage for future use
                localStorage.setItem("userImage", userData.userImage);
            } else {
                // Set default image if no user image is available
                $('#profileImage').attr('src', 'https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching profile photo:", error);
            // Set default image on error
            $('#profileImage').attr('src', 'https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000');
        }
    });
}


