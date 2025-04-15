$(document).ready(function () {
    // Function to get URL parameters
    function getQueryParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Retrieve category details from URL
    let categoryId = getQueryParam("id");
    let categoryName = getQueryParam("name");
    let categoryImage = getQueryParam("imageUrl"); // Existing image URL
    let parentCategoryId = getQueryParam("parentCategoryId");

    console.log("Category ID:", categoryId);
    console.log("Category Name:", categoryName);
    console.log("Category Image:", categoryImage);

    // Set values in the form fields
    $("#category-name").val(categoryName);

    // Set existing category image
    if (categoryImage) {
        $("#blah").attr("src", "http://localhost:8082/" + categoryImage);
    }

    // Handle category save/update
    $("#save-category").click(function (event) {
        event.preventDefault(); // Prevent default form submission

        let categoryName = $("#category-name").val().trim();
        let imageFile = $("#imgInp")[0].files[0]; // New selected image file
        let token = localStorage.getItem("token"); // Get JWT token from local storage

        console.log("Category Name:", categoryName);
        console.log("Image File:", imageFile);

        // Validation: Ensure category name is provided
        if (!categoryName) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Category Name is required!",
            });
            return;
        }

        // Create category data object
        let categoryData = {
            id: categoryId,
            name: categoryName,
            parentCategoryId: parentCategoryId,
            imageUrl: categoryImage // Keep existing image URL if no new image is selected
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
                    text: "Category updated successfully!",
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
                    text: xhr.responseJSON?.message || "Something went wrong!",
                });
            },
            complete: function () {
                $(".btn-submit").prop("disabled", false);
            }
        });
    });
});
