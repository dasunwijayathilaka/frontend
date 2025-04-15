



let selectedFiles = []; // will contain both existing and new files
let existingImages = []; // just to keep track of existing from DB


$(document).ready(function () {
    const adData = JSON.parse(sessionStorage.getItem("editAd"));

    console.log("Ad details: " + JSON.stringify(adData));


    if (!adData) {
        alert("No ad data found. Please go back and try again.");
        window.location.href = "your-listing-page.html";
        return;
    }

    // Set basic ad data
    $("#listingTitle").val(adData.title);
    $("#listingPrice").val(adData.price);
    $("#listingDescription").val(adData.description);
    $("#status").val(adData.status);
    $("#adId").val(adData.id);

    if (adData.imageUrls && adData.imageUrls.length > 0) {
        $("#previewImage").attr("src", adData.imageUrls[0]);
    }


    // Step 1: Get the subcategory's parent (main category)
    $.ajax({
        url: `http://localhost:8082/api/v1/category/cid/${adData.categoryId}`,
        method: "GET",
        success: function (subCategory) {

            let subCategoryDropdown = $("#subCategory");
            let mainCategory = $("#mainCategory");

            const selected = "selected";
            subCategoryDropdown.append(`<option value="${subCategory[0].id}" ${selected}>${subCategory[0].name}</option>`);
            mainCategory.append(`<option value="${subCategory[0].parentCategoryId}" ${selected}>${subCategory[0].parentCategoryName}</option>`);

            // Step 2: Load main categories and set selected
            const parentCategoryGroupId = "550e8400-e29b-41d4-a716-446655440000";
            $.ajax({
                url: `http://localhost:8082/api/v1/category/${parentCategoryGroupId}`,
                method: "GET",
                dataType: "json",
                success: function (mainCats) {
                    let mainCategoryDropdown = $("#mainCategory");

                    mainCats.forEach(cat => {
                        mainCategoryDropdown.append(`<option value="${cat.id}">${cat.name}</option>`);
                    });

                    // Step 3: Load subcategories under the selected main category
                    loadSubCategories(mainCategory.val());
                }
            });
        }
    });

    function loadSubCategories(parentId) {
        let subCategoryDropdown = $("#subCategory");

        $.ajax({
            url: `http://localhost:8082/api/v1/category/${parentId}`,
            method: "GET",
            success: function (subCats) {


                subCats.forEach(sub => {
                    subCategoryDropdown.append(`<option value="${sub.id}">${sub.name}</option>`);
                });
            }
        });
    }

    $("#mainCategory").change(function () {

        let subCategoryDropdown = $("#subCategory");
        subCategoryDropdown.empty();
        subCategoryDropdown.append(`<option value=""> select</option>`);
        loadSubCategories($(this).val());
    });


    console.log("Location id: " + adData.locationId);


    // Step 1: Get the location
    $.ajax({
        url: `http://localhost:8082/api/v1/location/${adData.locationId}`,
        method: "GET",
        success: function (districts) {

            let citySelector = $("#city-select");
            let districtSelector = $("#district-select");

            const selected = "selected";
            citySelector.append(`<option value="${districts.id}" ${selected}>${districts.name}</option>`);
            districtSelector.append(`<option value="${districts.parentLocationId}" ${selected}>${districts.parentLocationName}</option>`);


            // Load locations
            const parentLocationId = "21bf6dc0-07b1-11f0-b8c1-83ce8323275c";
            $.ajax({
                url: 'http://localhost:8082/api/v1/location/parent/' + parentLocationId,
                type: 'GET',
                dataType: 'json',
                success: function (districts) {
                    let districtSelect = $('#district-select');
                    // districtSelect.html('<option value="">Select</option>');

                    districts.forEach(d => {
                        const selected = d.id === districts.id ? "selected" : "";
                        districtSelect.append(`<option value="${d.id}" ${selected}>${d.name}</option>`);
                    });


                    loadCities(districtSelect.val());
                }
            });
        }
    });

    function loadCities(districtId, selectedCityId) {
        if (!districtId) return;

        $.ajax({
            url: 'http://localhost:8082/api/v1/location/parent/' + districtId,
            type: 'GET',
            dataType: 'json',
            success: function (cities) {
                let citySelect = $('#city-select');


                cities.forEach(city => {
                    const selected = city.id === selectedCityId ? "selected" : "";
                    citySelect.append(`<option value="${city.id}" ${selected}>${city.name}</option>`);
                });
            }
        });
    }

    $('#district-select').change(function () {
        let citySelector = $("#city-select");
        citySelector.empty();
        citySelector.append(`<option value=""> select</option>`);
        loadCities($(this).val());
    });













    // Image set

    loadAdImages(adData.id); // make sure adData.id is a valid UUID

    console.log("Ad UUID: " + adData.id);

    // Event delegation for the remove image click
    $(document).on('click', '.profile-img-del', function () {
        $(this).closest('.gallery-upload').remove();
    });

// Handle new uploads
    $('#file2').on('change', function (e) {
        let files = e.target.files; // Get the selected files
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();

            // When the file is read, append the image preview
            reader.onload = function (event) {
                $('.galleryimg-upload').append(generateImageBox(event.target.result, files[i].name));
            };

            reader.readAsDataURL(files[i]); // Read the file as Data URL
        }
    });

// Function to generate HTML for the image preview
    function generateImageBox(src, name) {
        return `
        <div class="gallery-upload" data-name="${name}">
            <img src="${src}" alt="${name}" class="img-fluid" />
            <a href="javascript:void(0)" class="profile-img-del">
                <i class="feather-trash-2"></i>
            </a>
        </div>
    `;
    }







    console.log("nikan method eke " + selectedFiles);
    console.log("nikan method eke existingImages: " + JSON.stringify(existingImages));

    function loadAdImages(adId) {
        $.ajax({
            url: 'http://localhost:8082/api/v1/ad/get-ad-images/' + adId,
            type: 'GET',
            success: function (images) {
                $('.galleryimg-upload').empty();
                existingImages = images;

                images.forEach(image => {
                    const imageBox = `
                    <div class="gallery-upload existing" data-name="${image.name}">
                        <img src="${image.base64}" class="img-fluid" alt="Image" />
                        <a href="javascript:void(0)" class="profile-img-del profile-img-del">
                            <i class="feather-trash-2"></i>
                        </a>
                    </div>`;
                    $('.galleryimg-upload').append(imageBox);

                    // Convert base64 to File object and push to selectedFiles
                    const file = base64ToFile(image.base64, image.name);
                    selectedFiles.push(file);
                });
            },
            error: () => alert('Failed to load images.')
        });
    }

    function base64ToFile(base64, filename) {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }





// 2. Handle new uploads
    $("#file2").on("change", function (e) {
        let files = Array.from(e.target.files);

        // Check if adding these files would exceed the limit
        if (selectedFiles.length + files.length > 5) {
            Swal.fire({
                title: "Too Many Images",
                text: "You can upload a maximum of 5 images per listing. You currently have " + selectedFiles.length + " images.",
                icon: "warning",
                background: '#fff',
                customClass: {
                    popup: 'white-background-popup'
                }
            });
            $(this).val(''); // Clear the file input
            return;
        }


        files.forEach(file => {
            if (!selectedFiles.some(f => f.name === file.name)) {
                selectedFiles.push(file);

                let reader = new FileReader();
                reader.onload = function (e) {
                    const imgBox = `
                    <div class="gallery-upload" data-name="${file.name}">
                        <img src="${e.target.result}" class="img-fluid" />
                        <a href="javascript:void(0)" class="profile-img-del profile-img-del">
                            <i class="feather-trash-2"></i>
                        </a>
                    </div>`;
                    $(".galleryimg-upload").append(imgBox);
                };
                reader.readAsDataURL(file);
            }
        });
        $(this).val(''); // Reset input
    });



// 5. Submit the form
    $("#submitAdBtn").click(function (e) {
        e.preventDefault();

        // Check if there are more than 5 images
        if (selectedFiles.length > 5) {
            Swal.fire({
                title: "Too Many Images",
                text: "You can upload a maximum of 5 images per listing.",
                icon: "warning",
                background: '#fff',
                customClass: {
                    popup: 'white-background-popup'
                }
            });
            return; // Stop form submission
        }

        let adDTO = {
            id: adData.id,
            title: $("#listingTitle").val(),
            description: $("#listingDescription").val(),
            price: parseFloat($("#listingPrice").val()),
            status: "ACTIVE",
            userId: localStorage.getItem("loggedInUserId"),
            categoryId: $("#subCategory").val(),
            locationId: $("#city-select").val(),
            existingImageNames: existingImages.map(img => img.name)
        };

        let formData = new FormData();
        formData.append("adDTO", JSON.stringify(adDTO));
        selectedFiles.forEach(file => formData.append("images", file));

        $.ajax({
            url: "http://localhost:8082/api/v1/ad/updateAd",
            type: "PUT",
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") },
            success: res => Swal.fire({
                title: "Updated!",
                text: "Ad updated successfully.",
                icon: "success",
                background: '#ffffff',
                customClass: {
                    popup: 'white-background-popup'
                }
            }).then(() => location.href = "my-listing.html"),
            error: err => Swal.fire({
                title: "Error",
                text: "Failed to update ad: " + err.responseText,
                icon: "error",
                background: '#ffffff',
                customClass: {
                    popup: 'white-background-popup'
                }
            })
        });
    });


    $(document).on('click', '.profile-img-del', function(e) {
        e.preventDefault();
        console.log("Delete button clicked");

        const $galleryItem = $(this).closest('.gallery-upload');

        if ($galleryItem.hasClass('existing')) {
            removeExistingImage(this);
        } else {
            removeNewImage(this);
        }
    });






});


function removeNewImage(el) {
    const name = $(el).closest('.gallery-upload').data('name');
    console.log("Removing new image with name:", name);
    console.log("Before removal - selectedFiles count:", selectedFiles.length);
    selectedFiles = selectedFiles.filter(f => f.name !== name);
    console.log("After removal - selectedFiles count:", selectedFiles.length);
    $(el).closest('.gallery-upload').remove();
}

function removeExistingImage(el) {
    const name = $(el).closest('.gallery-upload').data('name');
    console.log("Removing existing image with name:", name);
    console.log("Before removal - existingImages count:", existingImages.length);
    console.log("Before removal - selectedFiles count:", selectedFiles.length);

    // Remove from both arrays (only once)
    existingImages = existingImages.filter(img => img.name !== name);
    selectedFiles = selectedFiles.filter(file => file.name !== name);

    console.log("After removal - existingImages count:", existingImages.length);
    console.log("After removal - selectedFiles count:", selectedFiles.length);

    $(el).closest('.gallery-upload').remove();
}