// Wait for document to be fully loaded
$(document).ready(function () {
    // Show loading indicator
    $('#latest-ads-section').html('<div class="text-center p-4"><i class="fas fa-spinner fa-spin fa-2x"></i><p class="mt-2">Loading ads...</p></div>');

    // Function to fetch and display ads
    function loadAds() {
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();

        $.ajax({
            url: `http://localhost:8082/api/v1/ad/getAllActiveAds?_=${timestamp}`,
            method: "GET",
            cache: false, // Explicitly prevent caching
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            },
            success: function (response) {
                console.log("Raw response:", response);

                if (response && response.code === 200 && Array.isArray(response.data)) {
                    console.log("Parsed ads data:", response.data);
                    displayAds(response.data);
                } else {
                    handleNoAds("No active ads found or invalid response format.");
                    console.warn("Response structure:", response);
                }
            },
            error: function (xhr, status, error) {
                handleNoAds("Failed to fetch active ads.");
                console.error("Error details:", status, error);
                console.error("XHR object:", xhr);
            }
        });
    }

    // Function to display ads on the page
    function displayAds(ads) {
        const container = $('#latest-ads-section');

        // If no ads, show a message
        if (!ads || ads.length === 0) {
            handleNoAds("No active ads available at this time.");
            return;
        }

        // Clear the container
        container.empty();

        // Take just the first 8 ads
        const latestAds = ads.slice(0, 8);

        // Create HTML for each ad and append to container
        latestAds.forEach(function (ad) {
            const firstImage = ad.imageUrls && ad.imageUrls.length > 0
                ? ad.imageUrls[0]
                : 'html/assets/img/404-error.jpg';

            const timeAgo = timeAgoFormat(ad.createdAt);
            const priceFormatted = Number(ad.price).toLocaleString();

            const adHtml = `
            <div class="col-lg-3 col-md-4 col-sm-6 d-flex">
                <div class="card aos flex-fill">
                    <div class="blog-widget">
                        <div class="blog-img">
                            <a href="html/product.html?id=${ad.id}">
                                <img src="${firstImage}" class="img-fluid" alt="${ad.title}" loading="lazy">
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
                                        <a href="javascript:void(0)"><span><i class="fa-regular fa-circle-stop"></i> ${ad.categoryName || 'Uncategorized'}</span></a>
                                    </div>
                                    <div class="blog-author text-end"></div>
                                </div>
                                <h6><a href="html/product.html?id=${ad.id}">${ad.title}</a></h6>
                                <div class="blog-location-details">
                                    <div class="location-info">
                                        <i class="feather-map-pin"></i> ${ad.parentLocationName || 'Location not specified'}
                                    </div>
                                    <div class="location-info">
                                        <i class="fa-solid fa-calendar-days"></i> ${timeAgo}
                                    </div>
                                </div>
                                <div class="amount-details">
                                    <div class="amount">
                                        <span class="validrate">Rs. ${priceFormatted}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            container.append(adHtml);
        });

        // If you're using AOS animation library, refresh it
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Handle case when no ads are available
    function handleNoAds(message) {
        const container = $('#latest-ads-section');
        container.html(`
            <div class="col-12 text-center p-4">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i> ${message}
                </div>
            </div>
        `);
    }

    // Format date as time ago
    function timeAgoFormat(dateString) {
        if (!dateString) return 'Unknown date';

        try {
            const postedDate = new Date(dateString);
            if (isNaN(postedDate.getTime())) return 'Invalid date';

            const now = new Date();
            const diff = Math.floor((now - postedDate) / 1000);

            if (diff < 60) return 'Just now';

            const minutes = Math.floor(diff / 60);
            if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

            const hours = Math.floor(diff / 3600);
            if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

            const days = Math.floor(diff / 86400);
            if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;

            const months = Math.floor(days / 30);
            if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

            const years = Math.floor(days / 365);
            return `${years} year${years !== 1 ? 's' : ''} ago`;
        } catch (e) {
            console.error("Error formatting date:", e);
            return 'Date error';
        }
    }

    // Load ads immediately
    loadAds();

    // Optional: Refresh ads periodically (every 5 minutes)
    // setInterval(loadAds, 300000);
});