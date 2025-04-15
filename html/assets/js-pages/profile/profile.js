$(document).ready(function() {

    const userId = localStorage.getItem("loggedInUserId");

    // Make the AJAX request to get user data
    $.ajax({
        url: `http://localhost:8082/api/v1/user/${userId}`,
        method: 'GET',
        dataType: 'json',
        success: function(user) {
            // Set the profile image
            if (user.userImage) {
                $('.settings-upload-img img').attr('src', user.userImage);
            } else {
                $('.settings-upload-img img').attr('src', 'https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000');
            }

            // Set the form field values
            // Assuming the input fields are in the same order as mentioned in your example
            // First text input - presumably for name
            $('input[type="text"].form-control').eq(0).val(user.name);

            // Phone input
            $('input[type="tel"].form-control').val(user.phone);

            // Email input (the one with "this is email" comment)
            $('input[type="text"].form-control').eq(1).val(user.email);
        },
        error: function(xhr, status, error) {
            console.error("Error fetching user data:", error);
            alert("Failed to load user data. Please try again later.");
        }
    });



//---------------------------------------------------------------------------------------




    // Handle image upload
    $('#file').change(function(e) {
        const file = this.files[0];

        // Check if a file was selected
        if (!file) return;

        // Check file size (10MB = 10 * 1024 * 1024 bytes)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes

        if (file.size > maxSize) {
            Swal.fire({
                title: 'File Too Large',
                text: 'The selected file exceeds the maximum size of 10MB.',
                icon: 'error',
                confirmButtonColor: '#3085d6'
            });
            // Reset the file input
            $(this).val('');
            return;
        }

        // File is valid, preview it
        const reader = new FileReader();
        reader.onload = function(event) {
            $('.settings-upload-img img').attr('src', event.target.result);
        };
        reader.readAsDataURL(file);

        // You can add code here to upload the file to your server using FormData and AJAX
        // For now, just show a success message

        uploadImageToServer(file);

        Swal.fire({
            title: 'Image Selected',
            text: 'Your new profile photo has been selected.',
            icon: 'success',
            confirmButtonColor: '#3085d6'
        });
    });



// delete image
    $('.profile-img-del').on('click', function(e) {
        e.preventDefault();
        // Use SweetAlert for confirmation
        Swal.fire({
            title: 'Delete Profile Photo',
            text: 'Are you sure you want to delete your profile photo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            background: '#fff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Reset the image to default (UI only)
                $('.settings-upload-img img').attr('src', 'https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000');

                // Call the delete function instead of uploadImageToServer
                deleteUserPhoto();

                // Success message
                Swal.fire(
                    'Deleted!',
                    'Your profile photo has been deleted.',
                    'success'
                );
            }
        });
    });

// Function to delete user photo
    function deleteUserPhoto() {
        const userId = localStorage.getItem("loggedInUserId");

        $.ajax({
            url: `http://localhost:8082/api/v1/user/${userId}/photo`,
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                console.log("Photo deleted successfully");
            },
            error: function(xhr, status, error) {
                console.error("Error deleting photo:", error);
            }
        });
    }

// Upload image function
    function uploadImageToServer(file) {
        // Get user ID from local storage
        const userId = localStorage.getItem("loggedInUserId");

        // Convert file to base64
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64String = event.target.result;
            console.log("Base64 string:", base64String);

            // Send the base64 string to server using userImage property
            $.ajax({
                url: `http://localhost:8082/api/v1/user/${userId}/photo`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    userImage: base64String  // Changed from imageBase64 to userImage
                }),
                success: function(response) {
                    loadProfilePhoto();
                    Swal.fire({
                        title: 'Upload Successful',
                        text: 'Your profile photo has been updated.',
                        icon: 'success',
                        background: '#fff',
                        confirmButtonColor: '#3085d6'
                    });
                },
                error: function(xhr, status, error) {
                    console.error("Error uploading image:", error);
                    Swal.fire({
                        title: 'Upload Failed',
                        text: 'There was a problem uploading your photo. Please try again.',
                        icon: 'error',
                        background: '#fff',
                        confirmButtonColor: '#3085d6'
                    });
                }
            });
        };
        reader.readAsDataURL(file);
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


});