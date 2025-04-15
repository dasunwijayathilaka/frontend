$(document).ready(function() {


    // Handle category save
    $("#save-category").click(function (event) {
        event.preventDefault(); // Prevent default form submission

        let categoryName = $("#category-name").val().trim();
        let imageFile = $("#imgInp")[0].files[0]; // New selected image file
        let parentCategoryId = "550e8400-e29b-41d4-a716-446655440000";
        let token = localStorage.getItem("token"); // Get JWT token from local storage

        console.log("Category Name:", categoryName);
        console.log("Image File:", imageFile);

        // Validation: Ensure category name is provided
        if (!categoryName) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Category Name is required!",
                background: '#fff'
            });
            return;
        }

        if (!imageFile) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Category Image is required!",
                background: '#fff'
            });
            return;
        }

        // Create category data object
        let categoryData = {
            name: categoryName,
            parentCategoryId: parentCategoryId
        };

        let formData = new FormData();
        formData.append("category", JSON.stringify(categoryData)); // Append category data as JSON string

        // Append new image file only if selected
        if (imageFile) {
            formData.append("image", imageFile);
        }

        $.ajax({
            url: "http://localhost:8082/api/v1/category/create", // Use update if editing
            type: "POST",
            headers: {
                "Authorization": `Bearer ${token}` // Send JWT token
            },
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $(".btn-submit").prop("disabled", true);
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    background: '#fff',
                    text: "Category created successfully!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = "categories.html";
                });
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    background: '#fff',
                    text: xhr.responseJSON?.message || "Something went wrong!",
                });
            },
            complete: function () {
                $(".btn-submit").prop("disabled", false);
            }
        });
    });

});

