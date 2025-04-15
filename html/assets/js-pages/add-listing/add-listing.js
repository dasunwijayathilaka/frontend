$(document).ready(function () {





// -----------------------------------------------------------------------------------


    // set data to category selectors

    var parentCategoryId = "550e8400-e29b-41d4-a716-446655440000";


    // Load parent categories on page load
    $.ajax({
        url: `http://localhost:8082/api/v1/category/${parentCategoryId}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            let mainCategoryDropdown = $("#mainCategory");
            mainCategoryDropdown.append('<option value="0" selected>Select</option>');
            $.each(data, function (index, category) {
                mainCategoryDropdown.append(`<option value="${category.id}">${category.name}</option>`);
            });
        }
    });

    // Load subcategories when a main category is selected
    $("#mainCategory").change(function () {
        let parentId = $(this).val();
        let subCategoryDropdown = $("#subCategory");
        subCategoryDropdown.html('<option value="0" selected>Select</option>'); // Clear previous options

        if (parentId) {
            $.ajax({
                url: `http://localhost:8082/api/v1/category/${parentId}`,
                method: "GET",
                success: function (data) {
                    subCategoryDropdown.append('<option value="0" selected>Select</option>');
                    $.each(data, function (index, category) {
                        subCategoryDropdown.append(`<option value="${category.id}">${category.name}</option>`);
                    });
                }
            });
        }
    });






// -----------------------------------------------------------------------------------



    // set data to location selectors

    var parentLocationId = "21bf6dc0-07b1-11f0-b8c1-83ce8323275c";

    // Populate District Dropdown
    $.ajax({
        url: 'http://localhost:8082/api/v1/location/parent/' + parentLocationId,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var select = $('#district-select');
            select.empty();
            select.append('<option value="" selected>select</option>');

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
    $('#district-select').change(function() {
        var districtId = $(this).val();

        if (districtId) {

            $.ajax({
                url: 'http://localhost:8082/api/v1/location/parent/' + districtId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    var citySelect = $('#city-select');
                    citySelect.empty();
                    citySelect.append('<option value="" selected>select</option>');

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





// -----------------------------------------------------------------------------------




    let selectedFiles = []; // Array to store selected images

    $("#file2").on("change", function (event) {
        let files = Array.from(event.target.files); // Convert FileList to an array

        files.forEach(file => {
            if (selectedFiles.length >= 5) {
                Swal.fire("Limit Exceeded", "You can upload a maximum of 5 images.", "warning");
                return;
            }

            if (!selectedFiles.some(f => f.name === file.name)) { // Avoid duplicate images
                selectedFiles.push(file);

                let reader = new FileReader();
                reader.onload = function (e) {
                    var newImage = `
                    <div class="gallery-upload" data-name="${file.name}">
                        <img src="${e.target.result}" class="img-fluid" alt="Uploaded Image">
                        <a href="javascript:void(0)" class="profile-img-del"><i class="feather-trash-2"></i></a>
                    </div>
                `;
                    $(".galleryimg-upload").append(newImage);
                };
                reader.readAsDataURL(file);
            }
        });

        $(this).val(''); // Reset file input
    });

// Handle Image Deletion
    $(document).on("click", ".profile-img-del", function () {
        let imageContainer = $(this).closest(".gallery-upload");
        let fileName = imageContainer.attr("data-name");
        imageContainer.remove();
        selectedFiles = selectedFiles.filter(file => file.name !== fileName);
    });



// -----------------------------------------------------------------------------------


// create new add listing

// Handle Form Submission
    $("#submitAdBtn").click(function (event) {
        event.preventDefault(); // Prevent default form submission

        let authToken = localStorage.getItem("token");
        console.log("token " + authToken);
        if (!authToken) {
            Swal.fire("Unauthorized", "You need to log in first!", "error");
            return;
        }

        let loggedInUserId = localStorage.getItem("loggedInUserId");

        let adDTO = {
            title: $("#listingTitle").val(),
            description: $("#listingDescription").val(),
            price: parseFloat($("#listingPrice").val()),
            status: "ACTIVE",
            userId: loggedInUserId,
            categoryId: $("#subCategory").val(),
            locationId: $("#city-select").val()
        };

        // **Validation Checks**
        if (!adDTO.title || !adDTO.description || isNaN(adDTO.price) || !adDTO.categoryId || !adDTO.locationId) {
            Swal.fire("Validation Error", "Please fill out all required fields!", "warning");
            return;
        }

        if (selectedFiles.length === 0) {
            Swal.fire("No Images", "You must upload at least one image!", "warning");
            return;
        }

        let adDTOJson = JSON.stringify(adDTO);
        let formData = new FormData();
        formData.append("adDTO", adDTOJson);

        selectedFiles.forEach((file, index) => {
            formData.append("images", file);
        });

        console.log("Total images selected:", selectedFiles.length);
        selectedFiles.forEach(file => console.log("Appending image:", file.name));

        // Send AJAX request with Authorization header
        $.ajax({
            url: "http://localhost:8082/api/v1/ad/createAd",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            success: function (response) {
                Swal.fire("Success", "Ad successfully created!", "success").then(() => {
                    window.location.href = "my-listing.html";
                });
            },
            error: function (xhr) {
                Swal.fire("Error", "Failed to create ad: " + xhr.responseText, "error");
            }
        });
    });


// -----------------------------------------------------------------------------------

});