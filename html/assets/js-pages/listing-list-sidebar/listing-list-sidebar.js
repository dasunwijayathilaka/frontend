$(document).ready(function () {
    let categoryMap = {};
    let locationMap = {};
    let excludeCategory = "21bf6dc0-07b1-11f0-b8c1-83ce8323275c"; // Excluded category ID

    let categoryDeferred = $.Deferred();
    let locationDeferred = $.Deferred();

    // Fetch all categories
    $.ajax({
        url: "http://localhost:8082/api/v1/category/getAll",
        type: "GET",
        dataType: "json",
        success: function (categories) {
            categories.forEach(category => {
                categoryMap[category.id] = category.name;
            });
            categoryDeferred.resolve(); // Mark category fetch as complete
        },
        error: function(error) {
            console.error("Error fetching categories:", error);
            categoryDeferred.resolve(); // Prevent hanging if error occurs
        }
    });

    // Fetch locations excluding a specific parent category
    $.ajax({
        url: `http://localhost:8082/api/v1/location/allSubCategories/exclude/${excludeCategory}`,
        type: "GET",
        dataType: "json",
        success: function (locations) {
            locations.forEach(location => {
                locationMap[location.id] = location.name;
            });
            locationDeferred.resolve(); // Mark location fetch as complete
        },
        error: function(error) {
            console.error("Error fetching locations:", error);
            locationDeferred.resolve(); // Prevent hanging if error occurs
        }
    });

    // Wait for both AJAX calls to complete before loading ads
    $.when(categoryDeferred, locationDeferred).done(function () {
        loadAllActiveAds();
    });

    // Load active ads function
    function loadAllActiveAds() {
        $.ajax({
            url: "http://localhost:8082/api/v1/ad/getAllActiveAds",
            type: "GET",
            dataType: "json",
            success: function(response) {
                if (response.code === 200) {
                    let adsContainer = $('#ads-container');
                    adsContainer.empty();

                    response.data.forEach(ad => {
                        let categoryName = categoryMap[ad.categoryId] || "Unknown Category";
                        let locationName = locationMap[ad.locationId] || "Unknown Location"; // Get location name

                        let timeAgo = moment(ad.createdAt).fromNow();

                        let adHtml = `
                         <a href="product.html?id=${ad.id}" style="z-index: 100;">
                             <div class="card" style="cursor:pointer;">
                                <div class="blog-widget">
                                    <div class="blog-img">
                                        <a href="product.html?id=${ad.id}">
                                            <img src="${ad.imageUrls[0]}" class="img-fluid" alt="${ad.title}">
                                        </a>
                                        <div class="fav-item">
                                            <a href="javascript:void(0)" class="fav-icon">
                                                <i class="feather-heart"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="bloglist-content">
                                        <div class="card-body">
                                            <div class="blogfeaturelink">
                                                <div class="blog-features">
                                                    <a href="javascript:void(0);"><span>${categoryName}</span></a>
                                                </div>
                                                <div class="blog-author">
                                                    <a href="javascript:void(0);"><i class="fa fa-user-circle"></i>${ad.userName}</a>
                                                </div>
                                            </div>
                                            <h6><a href="product.html?id=${ad.id}">${ad.title}</a></h6>
                                            <div class="blog-location-details">
                                                <div class="location-info">
                                                    <i class="feather-map-pin"></i> ${ad.parentLocationName || 'Location not specified'}
                                                </div>
                                                <div class="posted-time">
                                                <i class="fa fa-clock"></i> ${timeAgo}
                                            </div>
                                            </div>
                                            <div class="amount-details">
                                                <div class="amount">
                                                    <span class="validrate">Rs. ${ad.price.toLocaleString()}</span>
                                                </div>
                                                <a href="product.html?id=${ad.id}">View details</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        adsContainer.append(adHtml);
                    });
                }
            },
            error: function(error) {
                console.error("Error fetching ads:", error);
            }
        });
    }



//____________________________________________________________________________________________________________________________________




    // set data to location selectors

    var parentLocationId = "21bf6dc0-07b1-11f0-b8c1-83ce8323275c";

    // Populate District Dropdown
    $.ajax({
        url: 'http://localhost:8082/api/v1/location/parent/' + parentLocationId,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var select = $('#location-district-select');
            select.empty();
            select.append('<option value="" selected>All of Sri lanka</option>');

            if(response && response.length > 0) {
                response.forEach(function(location) {
                    select.append('<option value="' + location.id + '">' + location.name + '</option>');
                });
            } else {
                select.append('<option value="">No districts found</option>');
            }
        },
        error: function(error) {
            console.error("Error fetching districts:", error);
        }
    });

    // When a district is selected, fetch cities
    $('#location-district-select').change(function() {
        var districtId = $(this).val();

        if (districtId) {

            $.ajax({
                url: 'http://localhost:8082/api/v1/location/parent/' + districtId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    var citySelect = $('#location-city-select');
                    citySelect.empty();
                    // citySelect.append('<option value="" selected>select city</option>');
                    citySelect.append(`<option value="">All of this district</option>`);

                    if (response && response.length > 0) {
                        response.forEach(function(city) {
                            citySelect.append('<option value="' + city.id + '">' + city.name + '</option>');
                        });
                    } else {
                        citySelect.append('<option value="">No cities found</option>');
                    }
                },
                error: function(error) {
                    console.error("Error fetching cities:", error);
                }
            });
        } else {

            $('#city-select').empty().append('<option value="" selected>select</option>');
        }
    });


//____________________________________________________________________________________________________________________________________






    // set data to category selectors

    const parentCategoryId = "550e8400-e29b-41d4-a716-446655440000"; // Fixed ID for main categories

    // Fetch only main categories using parentCategoryId
    $.ajax({
        url: `http://localhost:8082/api/v1/category/${parentCategoryId}`, // Adjusted endpoint
        method: "GET",
        success: function (mainCategories) {
            if (Array.isArray(mainCategories)) {
                mainCategories.forEach(function (category) {
                    const catId = category.id;
                    const imageUrl = `http://localhost:8082/${category.imageUrl}`;
                    const categoryHtml = `
                        <li data-category-id="${catId}">
                            <label class="custom_check main-category-label" style="cursor: pointer;">
                                <img class="sidebar-category-img" src="${imageUrl}" alt="category-icon">
                                <span>${category.name}</span>
                            </label>
                            <ul class="subcategories-list" id="sub-${catId}" style="margin-left: 50px;"></ul>
                        </li>
                    `;
                    $('#category-list').append(categoryHtml);
                });
            }
        },
        error: function () {
            console.error("Failed to fetch main categories");
        }
    });


    // Handle main category click to fetch subcategories
    $('#category-list').on('click', '.main-category-label', function () {
        const parentLi = $(this).closest('li');
        const categoryId = parentLi.data('category-id');
        const subUl = parentLi.find('.subcategories-list');

        // Prevent duplicate loading
        if (subUl.children().length > 0) {
            subUl.toggle(); // toggle show/hide
            return;
        }

        // Fetch subcategories for clicked main category
        $.ajax({
            url: `http://localhost:8082/api/v1/category/${categoryId}`,
            method: "GET",
            success: function (subcategories) {
                if (Array.isArray(subcategories)) {
                    subcategories.forEach(function (sub) {
                        const subHtml = `
                               <li>
    <label class="custom_check">
        <span data-subcategory-id="${sub.id}">${sub.name}</span>
    </label>
</li>

                        `;
                        subUl.append(subHtml);
                    });
                    subUl.slideDown();
                }
            },
            error: function () {
                console.error("Failed to load subcategories for category " + categoryId);
            }
        });

    });




//____________________________________________________________________________________________________________________________________



    // filter ads



    let selectedSubCategory = null;
    let selectedDistrict = null;
    let selectedCity = null;
//
//     // Load ads function
//     function loadFilteredAds() {
//         const queryParams = [];
//
//         if (selectedSubCategory) {
//             queryParams.push(`subcategoryId=${selectedSubCategory}`);
//         }
//
//         if (selectedDistrict) {
//             queryParams.push(`districtId=${encodeURIComponent(selectedDistrict)}`);
//         }
//
//         if (selectedCity) {
//             queryParams.push(`cityId=${encodeURIComponent(selectedCity)}`);
//         }
//
//         const url = `http://localhost:8082/api/v1/ad/filter?${queryParams.join('&')}`;
//
//         $.ajax({
//             url: url,
//             method: "GET",
//             success: function (ads) {
//                 $('#ads-container').empty();
//
//                 if (ads.length > 0) {
//                     let adsContainer = $('#ads-container');
//
//                     ads.forEach(ad => {
//
//
//
//                         let timeAgo = moment(ad.createdAt).fromNow();
//                         let firstImage = (ad.imageUrls && ad.imageUrls.length > 0)
//                             ? ad.imageUrls[0]
//                             : 'assets/img/404-error.jpg';
//
//                         const adHtml = `
//                     <a href="product.html?id=${ad.id}" style="z-index: 100;">
//                         <div class="card" style="cursor:pointer;">
//                             <div class="blog-widget">
//                                 <div class="blog-img">
//                                     <a href="product.html?id=${ad.id}">
//                                         <img src="${firstImage}" class="img-fluid" alt="${ad.title}">
//                                     </a>
//                                     <div class="fav-item">
//                                         <a href="javascript:void(0)" class="fav-icon">
//                                             <i class="feather-heart"></i>
//                                         </a>
//                                     </div>
//                                 </div>
//                                 <div class="bloglist-content">
//                                     <div class="card-body">
//                                         <div class="blogfeaturelink">
//                                             <div class="blog-features">
//                                                 <a href="javascript:void(0);"><span>${ad.categoryName}</span></a>
//                                             </div>
//                                             <div class="blog-author">
//                                                 <a href="javascript:void(0);"><i class="fa fa-user-circle"></i> ${ad.userName}</a>
//                                             </div>
//                                         </div>
//                                         <h6><a href="product.html?id=${ad.id}">${ad.title}</a></h6>
//                                         <div class="blog-location-details">
//                                             <div class="location-info">
//                                                 <i class="feather-map-pin"></i> ${ad.locationName}
//                                             </div>
//                                             <div class="posted-time">
//                                                 <i class="fa fa-clock"></i> ${timeAgo}
//                                             </div>
//                                         </div>
//                                         <div class="amount-details">
//                                             <div class="amount">
//                                                 <span class="validrate">Rs. ${ad.price.toLocaleString()}</span>
//                                             </div>
//                                             <a href="product.html?id=${ad.id}">View details</a>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </a>
//                 `;
//                         adsContainer.append(adHtml);
//                     });
//                 } else {
//                     $('#ads-container').html("<p>No ads found for the selected filters.</p>");
//                 }
//             },
//             error: function () {
//                 console.error("Failed to load filtered ads");
//                 $('#ads-container').html("<p>Failed to load ads. Please try again later.</p>");
//             }
//         });
//
//
//     }
//
// // Event listeners
//     $('#category-list').on('click', '.subcategories-list span', function () {
//         selectedSubCategory = $(this).data('subcategory-id');
//         console.log("Selected subcategory ID:", selectedSubCategory);
//         loadFilteredAds();
//     });
//
//
//
//     $('#location-district-select').on('change', function () {
//         selectedDistrict = $(this).val();
//         console.log("Selected district:" + selectedDistrict);
//         loadFilteredAds();
//     });
//
//     $('#location-city-select').on('change', function () {
//         selectedCity = $(this).val();
//         console.log("Selected city:" + selectedCity);
//         loadFilteredAds();
//     });
//
//







// Event listener for subcategory selection
    $('#category-list').on('click', '.subcategories-list span', function() {
        $('.subcategories-list span').removeClass('active');
        $(this).addClass('active');

        selectedSubCategory = $(this).data('subcategory-id');
        console.log("Selected subcategory ID:", selectedSubCategory);
        loadFilteredAds();
    });

// District selection event
    $('#location-district-select').on('change', function() {
        selectedDistrict = $(this).val();
        console.log("Selected district:", selectedDistrict);

        // Reset city when district changes
        $('#location-city-select').val('');
        selectedCity = null;

        loadFilteredAds();
    });

// City selection event
    $('#location-city-select').on('change', function() {
        selectedCity = $(this).val();
        console.log("Selected city:", selectedCity);
        loadFilteredAds();
    });

// Clear all filters button
    $('#clear-filters').on('click', function() {
        selectedSubCategory = null;
        selectedDistrict = null;
        selectedCity = null;

        // Reset UI
        $('.subcategories-list span').removeClass('active');
        $('#location-district-select').val('');
        $('#location-city-select').val('');

        loadFilteredAds();
    });


    function loadFilteredAds() {
        // Show loading indicator
        $('#ads-container').html('<div class="loading-spinner"><i class="fa fa-spinner fa-spin"></i> Loading...</div>');

        const queryParams = [];
        if (selectedSubCategory) {
            queryParams.push(`subcategoryId=${selectedSubCategory}`);
        }
        if (selectedDistrict) {
            queryParams.push(`districtId=${selectedDistrict}`);
        }
        if (selectedCity) {
            queryParams.push(`cityId=${selectedCity}`);
        }

        const url = `http://localhost:8082/api/v1/ad/filter?${queryParams.join('&')}`;

        $.ajax({
            url: url,
            method: "GET",
            success: function(ads) {
                $('#ads-container').empty();
                if (ads && ads.length > 0) {
                    let adsContainer = $('#ads-container');
                    ads.forEach(ad => {
                        let timeAgo = moment(ad.createdAt).fromNow();
                        let firstImage = (ad.imageUrls && ad.imageUrls.length > 0)
                            ? ad.imageUrls[0]
                            : 'assets/img/404-error.jpg';

                        const adHtml = `
                    <a href="product.html?id=${ad.id}" style="z-index: 100;">
                        <div class="card" style="cursor:pointer;">
                            <div class="blog-widget">
                                <div class="blog-img">
                                    <a href="product.html?id=${ad.id}">
                                        <img src="${firstImage}" class="img-fluid" alt="${ad.title}">
                                    </a>
                                    <div class="fav-item">
                                        <a href="javascript:void(0)" class="fav-icon">
                                            <i class="feather-heart"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="bloglist-content">
                                    <div class="card-body">
                                        <div class="blogfeaturelink">
                                            <div class="blog-features">
                                                <a href="javascript:void(0);"><span>${ad.categoryName}</span></a>
                                            </div>
                                            <div class="blog-author">
                                                <a href="javascript:void(0);"><i class="fa fa-user-circle"></i> ${ad.userName}</a>
                                            </div>
                                        </div>
                                        <h6><a href="product.html?id=${ad.id}">${ad.title}</a></h6>
                                        <div class="blog-location-details">
                                            <div class="location-info">
                                                <i class="feather-map-pin"></i> ${ad.locationName}
                                            </div>
                                            <div class="posted-time">
                                                <i class="fa fa-clock"></i> ${timeAgo}
                                            </div>
                                        </div>
                                        <div class="amount-details">
                                            <div class="amount">
                                                <span class="validrate">Rs. ${ad.price.toLocaleString()}</span>
                                            </div>
                                            <a href="product.html?id=${ad.id}">View details</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                `;
                        adsContainer.append(adHtml);
                    });
                    // Update count display
                    $('#results-count').text(`Showing 1-${ads.length} of ${ads.length} Results`);
                } else {
                    $('#ads-container').html("<p>No ads found for the selected filters.</p>");
                    $('#results-count').text("Showing 0 Results");
                }
            },
            error: function(xhr, status, error) {
                console.error("Failed to load filtered ads:", error);
                $('#ads-container').html("<p>Failed to load ads. Please try again later.</p>");
            }
        });
    }





});
