$(document).ready(function () {
    let excludeParentId = "550e8400-e29b-41d4-a716-446655440000"; // Parent ID to exclude

    $.ajax({
        url: "http://localhost:8082/api/v1/category/getAll",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let tableBody = $("#sub-category-body");
            tableBody.empty(); // Clear previous data

            let defaultImage = "assets/img/default-category-image.png"; // Default image path

            // Convert array to an object for faster lookup
            let categoryMap = {};
            data.forEach(category => {
                categoryMap[category.id] = category;
            });

            // Filter only valid subcategories (excluding the unwanted parent ID)
            let subcategories = data.filter(category =>
                category.parentCategoryId &&
                categoryMap[category.parentCategoryId] &&
                category.parentCategoryId !== excludeParentId
            );

            subcategories.forEach(function (subcategory, index) {
                // Get the parent category image
                let parentCategory = categoryMap[subcategory.parentCategoryId];
                let imageUrl = subcategory.imageUrl
                    ? `http://localhost:8082/${subcategory.imageUrl}`
                    : (parentCategory?.imageUrl
                        ? `http://localhost:8082/${parentCategory.imageUrl}`
                        : defaultImage);

                let editUrl = `edit-subcategories.html?id=${encodeURIComponent(subcategory.id)}&name=${encodeURIComponent(subcategory.name)}&imageUrl=${encodeURIComponent(subcategory.imageUrl || '')}&parentCategoryId=${encodeURIComponent(subcategory.parentCategoryId || '')}`;

                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <div class="table-imgname">
                                <img src="${imageUrl}" class="me-2" alt="img">
                            </div>
                        </td>
                        <td>${subcategory.name}</td>
                        <td>
                            <div class="table-actions d-flex">
                                <a class="delete-table me-2" href="${editUrl}">
                                    <img src="assets/img/icons/edit.svg" alt="edit">
                                </a>
                                <a class="delete-table" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete-item">
                                    <img src="assets/img/icons/delete.svg" alt="delete">
                                </a>
                            </div>
                        </td>
                    </tr>
                `;

                tableBody.append(row);
            });

            if (subcategories.length === 0) {
                tableBody.append(`<tr><td colspan="4" class="text-center">No subcategories found</td></tr>`);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching subcategories:", error);
        }
    });
});
