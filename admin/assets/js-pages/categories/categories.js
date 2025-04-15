$(document).ready(function () {
    $.ajax({
        url: "http://localhost:8082/api/v1/category/getAll",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let tableBody = $("#categoryTable-body");
            tableBody.empty(); // Clear previous data

            let defaultImage = "assets/img/default-category-image.png"; // Default image path
            let parentCategoryId = "550e8400-e29b-41d4-a716-446655440000"; // Target parent category ID

            let filteredData = data.filter(category => category.parentCategoryId === parentCategoryId);

            filteredData.forEach(function (category, index) {
                let imageUrl = category.imageUrl ? "http://localhost:8082/" + category.imageUrl : defaultImage; // Check if imageUrl is null

                // Create URL parameters for category details
                let editUrl = `edit-categories.html?id=${category.id}&name=${encodeURIComponent(category.name)}&imageUrl=${encodeURIComponent(category.imageUrl || '')}&parentCategoryId=${encodeURIComponent(category.parentCategoryId || '')}`;

                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <div class="table-imgname">
                                <img src="${imageUrl}" class="me-2" alt="img">
                            </div>
                        </td>
                        <td>${category.name}</td>
                        <td>
                            <div class="table-actions d-flex">
                                <a class="delete-table me-2" href="${editUrl}">
                                    <img src="assets/img/icons/edit.svg" alt="edit">
                                </a>
                                <a class="delete-table" href="javascript:void(0);" data-id="${category.id}" data-bs-toggle="modal" data-bs-target="#delete-item">
                                    <img src="assets/img/icons/delete.svg" alt="delete">
                                </a>
                            </div>
                        </td>
                    </tr>
                `;

                tableBody.append(row);
            });

            if (filteredData.length === 0) {
                tableBody.append(`<tr><td colspan="4" class="text-center">No categories found</td></tr>`);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching categories:", error);
        }
    });








    let selectedCategoryId = null; // Variable to store the selected category ID

    // When the delete button in the table is clicked
    $(document).on("click", ".delete-table", function () {
        selectedCategoryId = $(this).data("id"); // Store category ID from the clicked button
        console.log("Selected Category ID:", selectedCategoryId);
    });

    // Delete category when clicking the modal delete button
    $("#delete-category-button").click(function () {
        if (!selectedCategoryId) {
            Swal.fire("Error!", "No category selected for deletion.", "error");
            return;
        }

        let token = localStorage.getItem("token"); // Get JWT token

        console.log("Deleting category ID:", selectedCategoryId);
        console.log("Token:", token);

        $.ajax({
            url: `http://localhost:8082/api/v1/category/delete/${selectedCategoryId}`, // Adjust the API endpoint
            type: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    background: '#fff',
                    text: "Category deleted successfully!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = "categories.html";
                });
            },
            error: function (xhr) {
                Swal.fire("Error!", "Failed to delete category: " + xhr.responseText, "error");
            }
        });
    });








});
