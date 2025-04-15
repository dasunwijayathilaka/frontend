$(document).ready(function () {
    const parentCategoryId = '550e8400-e29b-41d4-a716-446655440000';

    // Step 1: Get all subcategories of the parent category
    $.ajax({
        url: `http://localhost:8082/api/v1/category/${parentCategoryId}`,
        method: 'GET',
        success: function (categories) {
            const container = $('#category-section');
            container.html(''); // Clear previous items

            categories.forEach(function (category) {
                // Create card with placeholder for ad count
                const card = $(`
                    <div class="col-lg-2 col-md-3 col-sm-6">
                        <a href="html/categories.html" class="category-links">
                            <h5>${category.name}</h5>
                            <span class="ad-count">Loading...</span>
                            <img src="http://localhost:8082/${category.imageUrl}" alt="icons">
                        </a>
                    </div>
                `);

                container.append(card);

                // Step 2: Get active ad count for the subcategory
                $.ajax({
                    url: `http://localhost:8082/api/v1/ad/count/by-parent-category/${category.id}`,
                    method: 'GET',
                    success: function (count) {
                        card.find('.ad-count').text(`${count} Ads`);
                    },
                    error: function () {
                        card.find('.ad-count').text('0 Ads');
                    }
                });
            });
        },
        error: function (xhr, status, error) {
            console.error('Failed to load categories:', error);
        }
    });
});