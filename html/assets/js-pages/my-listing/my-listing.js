$(document).ready(function () {
    let storedName = localStorage.getItem("name");


    if (storedName) {
        $("#logged-person-name").text(storedName); // ✅ Replace text inside span with class 'user-name'
    }










    let categoryMap = {}; // Store category ID to Name mapping

    // First, fetch all categories
    $.ajax({
        url: "http://localhost:8082/api/v1/category/getAll",  // Change to match your API
        type: "GET",
        dataType: "json",
        success: function (categories) {
            categories.forEach(category => {
                categoryMap[category.id] = category.name; // Store ID -> Name
            });

            // Now fetch ads
            loadAds();
        }
    });





    let userID = localStorage.getItem("loggedInUserId");


    function loadAds() {
        $.ajax({
            url: "http://localhost:8082/api/v1/ad/user/" + userID,  // Change this to match your backend API URL
            type: "GET",
            dataType: "json",
            success: function (data) {
                let tableBody = $("#listdata-table tbody");
                tableBody.empty(); // Clear existing rows

                data.forEach(function (ad) {
                    let firstImage = ad.imageUrls.length > 0 ? ad.imageUrls[0] : "assets/img/default.jpg"; // Default image
                    let categoryName = categoryMap[ad.categoryId] || "Unknown Category";



                    let row = `
                    <tr>
                        <td>
                            <div class="listingtable-img">
                                <a href="product.html?id=${ad.id}">
                                    <img class="img-fluid avatar-img" src="${firstImage}" alt="Ad Image">
                                </a>
                            </div>
                        </td>
                        <td>
                            <h6><a href="product.html?id=${ad.id}">${ad.title}</a></h6>
                            <div class="listingtable-rate">
                                <a href="javascript:void(0)" class="cat-icon">
                                     <i class="fa-regular fa-circle-stop"></i> ${categoryName} 
                                </a>
                            </div>
                            <span class="discount-amt" style="margin: 0;">Rs.${ad.price.toLocaleString()}</span>
                        </td>
                        <td><span class="status-text">${ad.status}</span></td>
                        <td><span class="views-count"></span></td>
                        <td>
                            <div class="action">
                                <a href="product.html?id=${ad.id}" class="action-btn btn-view"><i class="feather-eye"></i></a>
                                <a href="edit-listing.html" class="action-btn btn-edit" onclick='editAd(${JSON.stringify(ad)})'><i class="feather-edit-3"></i></a>

                                <a class="action-btn btn-trash" id="ad-delete-button" onclick='deleteAd("${ad.id}")'><i class="feather-trash-2"></i></a>

                            </div>
                        </td>
                    </tr>
                `;

                    tableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching ads:", error);
            }
        });
    }








});


