$(document).ready(function () {
    // Load Parent Categories from API
    $.ajax({
        url: "http://localhost:8082/api/v1/category/" + "550e8400-e29b-41d4-a716-446655440000", // Update with your API endpoint for categories
        type: "GET",
        success: function (categories) {
            let parentCategoryDropdown = $("#parent-category");
            parentCategoryDropdown.empty();
            parentCategoryDropdown.append(`<option value="0">Select</option>`);

            categories.forEach(category => {
                if (!category.parentCategory) { // Ensure it's a main category
                    parentCategoryDropdown.append(`<option value="${category.id}">${category.name}</option>`);
                }
            });
        },
        error: function (xhr) {
            console.error("Error loading categories:", xhr);
        }
    });


    // Save sub category
    $("#save-subcategory").click(function () {
        let parentCategoryId = $("#parent-category").val();
        let subCategoryName = $("#subcategory-name").val().trim();
        let token = localStorage.getItem("token"); // Get JWT token
        console.log(token);

        // Validation: Check if fields are filled
        if (parentCategoryId === "0") {
            Swal.fire({
                title: "Warning!",
                text: "Please select a parent category.",
                icon: "warning",
                background: "#f8f9fa", // Change this to your desired background color
                confirmButtonColor: "#3085d6"
            });
            return;
        }

        if (subCategoryName === "") {
            Swal.fire({
                title: "Warning!",
                text: "Please enter a sub category name.",
                icon: "warning",
                background: "#f8f9fa", // Change this to your desired background color
                confirmButtonColor: "#3085d6"
            });
            return;
        }

        let requestData = {
            name: subCategoryName,
            parentCategoryId: parentCategoryId
        };

        let formData = new FormData();
        formData.append("category", JSON.stringify(requestData));
        formData.append("image", undefined); // Correct way to send null in FormData


        // Send AJAX request to save subcategory
        $.ajax({
            url: "http://localhost:8082/api/v1/category/create",
            type: "POST",
            processData: false, // Important for FormData
            contentType: false, // Important for FormData
            headers: {
                "Authorization": `Bearer ${token}` // Send JWT token for authentication
            },
            data: formData,
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "sub category created successfully!",
                    showConfirmButton: false,
                    background: '#fff',
                    timer: 2000
                }).then(() => {
                    window.location.href = "sub-categories.html";
                });
            },
            error: function (xhr) {
                console.error("Error creating subcategory:", xhr);
                Swal.fire("Error!", "Failed to create subcategory: " + xhr.responseText, "error");
            }
        });
    });


});
