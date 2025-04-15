$(document).ready(function () {


    // Open fullscreen viewer
    $(".fullscreen-btn").click(function () {
        let currentSrc = $(".product-image").attr("src");
        currentIndex = imageList.indexOf(currentSrc);
        $("#viewerImage").attr("src", currentSrc);
        $("#imageViewer").fadeIn();
    });

    // Close fullscreen viewer
    $(".close-btn, #imageViewer").click(function (e) {
        if (e.target === this) {
            $("#imageViewer").fadeOut();
        }
    });

    // Next Image
    function showNextImage() {
        currentIndex = (currentIndex + 1) % imageList.length;
        $("#viewerImage").attr("src", imageList[currentIndex]);
        updateActiveThumbnail();
    }

    $(".next-btn").click(showNextImage);

    // Previous Image
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
        $("#viewerImage").attr("src", imageList[currentIndex]);
        updateActiveThumbnail();
    }

    $(".prev-btn").click(showPrevImage);

    // Update active thumbnail
    function updateActiveThumbnail() {
        $(".thumbnail").removeClass("active");
        $(".thumbnail").eq(currentIndex).addClass("active");
    }

    // Next/Previous with Arrow Navigation
    $(".next-arrow").click(showNextImage);
    $(".prev-arrow").click(showPrevImage);

    // Keyboard Navigation
    $(document).keydown(function (e) {
        if ($("#imageViewer").is(":visible")) {
            if (e.key === "ArrowRight") {
                showNextImage();
            } else if (e.key === "ArrowLeft") {
                showPrevImage();
            } else if (e.key === "Escape") {
                $("#imageViewer").fadeOut();
            }
        }
    });









    // Get adId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const adId = urlParams.get("id");

    if (!adId) {
        console.error("No Ad ID found in the URL");
        return;
    }

    let imageList = [];
    let currentIndex = 0;

    // Fetch ad details using AJAX
    $.ajax({
        url: `http://localhost:8082/api/v1/ad/getAdDetailsByAdId/${adId}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (!data || Object.keys(data).length === 0) {
                console.error("Ad data not found");
                return;
            }




            const chatButton = $('.chat-btn');

            // Set data attributes
            chatButton.attr('data-ad-id', data.id);
            chatButton.attr('data-seller-id', data.userId);
            chatButton.attr('data-seller-name', data.userName);
            chatButton.attr('data-seller-avatar', data.userImage || "https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000");

            // Add button to the page
            $('#contact-options').append(chatButton);

            // Set title, category, date, member since, location, and price
            $(".product-title").text(data.title);
            $(".seller-logo").attr("src", data.userImage || "https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000");
            $(".seller-avatar").attr("src", data.userImage || "https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000");
            // console.log("User image URL:", data.user.userImage);
            $(".category-name").text("Category : " + (data.categoryName || "Unknown Category"));
            $(".price").text(`Rs ${data.price.toLocaleString()}`);

            const formattedDate = data.createdAt
                ? new Date(data.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
                : "Unknown Seller";
            $(".product-meta").html(`Posted on ${formattedDate}<br>${data.locationName || "Unknown Location"}`);

            const memberSince = data.createdAt
                ? `Member since ${new Date(data.createdAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}`
                : "No member since";
            $(".member-since").text(memberSince);

            // Set description
            let descriptionHTML = `<h2 class="description-title">Description</h2>`;
            data.description.split("\n").forEach(para => {
                descriptionHTML += `<p>${para}</p>`;
            });
            $(".description").html(descriptionHTML);

            // Set images if available
            if (data.imageUrls && data.imageUrls.length > 0) {
                imageList = data.imageUrls; // Populate image list
                $(".product-image").attr("src", imageList[0]);

                // Set thumbnails
                let thumbnailHTML = "";
                imageList.forEach((imgUrl, index) => {
                    thumbnailHTML += `<img src="${imgUrl}" class="thumbnail ${index === 0 ? 'active' : ''}" alt="Thumbnail ${index + 1}">`;
                });
                $(".thumbnail-container").html(thumbnailHTML);

                // Add click event to change main image
                $(".thumbnail").click(function () {
                    $(".thumbnail").removeClass("active");
                    $(this).addClass("active");
                    $(".product-image").attr("src", $(this).attr("src"));
                });
            }

            // Set seller info
            $(".seller-name").text(data.userName || "Unknown Seller");
            $(".contact-btn div div").text(data.userPhone || "Not Available");

            // Now fetch other ads using sellerId
            if (data.userId) {
                fetchSellerAds(data.userId);
            } else {
                console.error("Seller ID not found.");
            }
        },
        error: function (error) {
            console.error("Error fetching ad details:", error);
        }
    });








    // Function to fetch seller's other ads
    function fetchSellerAds(sellerId) {

        $.ajax({
            url: `http://localhost:8082/api/v1/ad/user/` + sellerId,
            type: "GET",
            dataType: "json",
            success: function (ads) {
                if (!ads || ads.length === 0) {
                    $("#sellerProductsContainer").html("<p>No other ads from this seller.</p>");
                    return;
                }

                let productCards = "";
                ads.forEach(ad => {
                    if (ad.status === "ACTIVE") {
                        productCards += `
                        <div class="seller-another-products col-md-4 col-sm-6 col-12">
                            <div class="seller-product-card">
                                <a href="product.html?id=${ad.id}" class="text-decoration-none">
                                    <img src="${ad.imageUrls?.[0] || 'default.jpg'}" alt="${ad.title}">
                                    <div class="seller-product-info">
                                        <div class="seller-product-title">${ad.title}</div>
                                        <div class="seller-product-price">Rs ${ad.price.toLocaleString()}</div>
                                        <div class="seller-product-location">${ad.locationName || 'Unknown Location'}</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    `;
                    }

                });

                $("#sellerProductsContainer").html(productCards);
            },
            error: function (error) {
                console.error("Error fetching seller's other ads:", error);
            }
        });
    }





});
