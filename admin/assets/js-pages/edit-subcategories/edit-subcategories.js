$(document).ready(function () {
    // Function to get URL parameters
    function getQueryParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Retrieve subcategory details from URL
    let subcategoryId = getQueryParam("id");
    let subcategoryName = getQueryParam("name");
    let parentCategoryId = getQueryParam("parentCategoryId");

    console.log("Subcategory ID:", subcategoryId);
    console.log("Subcategory Name:", subcategoryName);
    console.log("Parent Category ID:", parentCategoryId);

    // Set subcategory name in input field
    $("#subcategory-name").val(subcategoryName);

    // Load Parent Categories from API
    $.ajax({
        url: "http://localhost:8082/api/v1/category/" + "550e8400-e29b-41d4-a716-446655440000", // Update with your API endpoint for categories
        type: "GET",
        success: function (categories) {
            let parentCategoryDropdown = $("#parent-category");
            parentCategoryDropdown.empty();
            parentCategoryDropdown.append(`<option value="0">Select</option>`);

            categories.forEach(category => {
                let selected = category.id === parentCategoryId ? "selected" : "";
                parentCategoryDropdown.append(`<option value="${category.id}" ${selected}>${category.name}</option>`);
            });
        },
        error: function (xhr) {
            console.error("Error loading categories:", xhr);
        }
    });

    // Save Subcategory
    $("#save-subcategory").click(function (event) {
        event.preventDefault();

        let subcategoryName = $("#subcategory-name").val().trim();
        let selectedParentCategoryId = $("#parent-category").val();

        if (!subcategoryName || selectedParentCategoryId === "0") {
            Swal.fire({
                title: "Validation Error",
                text: "Both Subcategory Name and Parent Category are required!",
                icon: "warning",
                background: "#f8f9fa", // Change this to your desired background color
                confirmButtonColor: "#3085d6"
            });
            return;
        }

        let subcategoryData = {
            id: subcategoryId,
            name: subcategoryName,
            parentCategoryId: selectedParentCategoryId
        };

        let formData = new FormData();
        formData.append("category", JSON.stringify(subcategoryData));
        formData.append("image", undefined); // Correct way to send null in FormData

        $.ajax({
            url: "http://localhost:8082/api/v1/category/create",
            type: "POST",
            processData: false, // Important for FormData
            contentType: false, // Important for FormData
            data: formData,
            beforeSend: function () {
                $("#save-subcategory").prop("disabled", true);
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.message,
                    showConfirmButton: false,
                    background: '#fff',
                    timer: 2000
                }).then(() => {
                    window.location.href = "sub-categories.html";
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
                $("#save-subcategory").prop("disabled", false);
            }
        });
    });
});
