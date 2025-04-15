$(document).ready(function() {
    // Variables
    let selectedImage = null;
    let currentAdId = null;
    let currentReceiverId = null;
    let loggedUserId = null;
    let messagesPollingInterval = null;

    // Initialize chat
    function initChat() {
        loggedUserId = localStorage.getItem("loggedInUserId");
        if (!loggedUserId) {
            return false;
        }
        return true;
    }

    // Open/Close Chat Functions
    $('.chat-btn').on('click', function() {
        if (!initChat()) {
            // Show SweetAlert and redirect after confirmation
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to access the chat feature.',
                confirmButtonText: 'Ok',
                background: '#fff',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        // Extract the necessary information
        const adId = $(this).data('ad-id');
        const sellerId = $(this).data('seller-id');
        const sellerName = $(this).data('seller-name');
        const sellerAvatar = $(this).data('seller-avatar') || '/assets/images/default-avatar.png';

        // Set current values
        currentAdId = adId;
        currentReceiverId = sellerId;

        // Update chat header info
        $('.seller-avatar').attr('src', sellerAvatar);
        $('.seller-name').text(sellerName);

        // Load conversation
        loadConversation(loggedUserId, sellerId, adId);

        // Show chat popup
        $('#chatPopup').fadeIn(300).css('display', 'flex');
        $('#overlay').fadeIn(300);
        $('#chatInput').focus();

        // Start polling for new messages
        startMessagesPolling();
    });

    $('.chat-close, #overlay').on('click', function() {
        $('#chatPopup').fadeOut(300);
        $('#overlay').fadeOut(300);

        // Stop polling for messages when chat is closed
        stopMessagesPolling();
    });

    // Load conversation
    function loadConversation(user1Id, user2Id, adId) {
        // Clear existing messages
        $('#chatBody').empty();

        // Show loading indicator
        $('#loadingIndicator').fadeIn(200);

        // Get conversation from server
        $.ajax({
            url: `http://localhost:8082/api/v1/chat/${user1Id}/${user2Id}/${adId}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                $('#loadingIndicator').fadeOut(200);

                // Process each message
                response.forEach(function(chat) {
                    displayMessage(chat);
                });

                // Scroll to bottom
                scrollToBottom();
            },
            error: function(error) {
                $('#loadingIndicator').fadeOut(200);
                console.error('Error loading conversation:', error);

                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load conversation. Please try again later.',
                    confirmButtonColor: '#3085d6'
                });
            }
        });
    }

    // Display a message in the chat
    function displayMessage(chat) {
        const messageClass = chat.senderId === loggedUserId ? 'sent' : 'received';
        const timestamp = new Date(chat.timestamp);
        const timeString = timestamp.getHours() + ':' +
            (timestamp.getMinutes() < 10 ? '0' : '') + timestamp.getMinutes();

        const $messageElement = $('<div>').addClass('message ' + messageClass);

        // Check if message contains image data (base64)
        if (chat.message && chat.message.startsWith('data:image')) {
            const $image = $('<img>')
                .addClass('message-image')
                .attr('src', chat.message)
                .attr('alt', 'Shared Image');
            $messageElement.append($image);
        } else {
            // Regular text message
            $messageElement.append($('<div>').text(chat.message));
        }

        $messageElement.append($('<div>').addClass('message-time').text(timeString));

        // Add message ID as data attribute for future reference
        $messageElement.attr('data-message-id', chat.id);

        $('#chatBody').append($messageElement);

        // Mark message as read if received
        if (messageClass === 'received' && chat.status === 'SENT') {
            markMessageAsRead(chat.id);
        }
    }

    // Send Message
    function sendMessage() {
        const messageText = $('#chatInput').val().trim();

        // If there's no image and no text, don't do anything
        if (messageText === '' && !selectedImage) return;

        // Prepare the message content
        let messageContent = messageText;
        if (selectedImage) {
            messageContent = selectedImage; // This will be the base64 image data
        }

        // Create chat DTO
        const chatDTO = {
            message: messageContent,
            status: 'SENT',
            timestamp: new Date().toISOString(),
            senderId: loggedUserId,
            receiverId: currentReceiverId,
            adId: currentAdId
        };

        // Show temporary message with loading state
        const tempMessageId = 'temp-' + Date.now();
        const currentTime = new Date();
        const timeString = currentTime.getHours() + ':' +
            (currentTime.getMinutes() < 10 ? '0' : '') +
            currentTime.getMinutes();

        const $messageElement = $('<div>').addClass('message sent loading');
        $messageElement.attr('data-temp-id', tempMessageId);

        if (selectedImage) {
            const $image = $('<img>')
                .addClass('message-image')
                .attr('src', selectedImage)
                .attr('alt', 'Sending Image...');
            $messageElement.append($image);
        } else {
            $messageElement.append($('<div>').text(messageText));
        }

        $messageElement.append($('<div>').addClass('message-time').text(timeString + ' ✓'));

        // Add to chat
        $('#chatBody').append($messageElement);

        // Clear inputs
        $('#chatInput').val('');
        if (selectedImage) {
            removeSelectedImage();
        }

        scrollToBottom();

        // Send to server
        $.ajax({
            url: 'http://localhost:8082/api/v1/chat/save',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(chatDTO),
            dataType: 'json',
            success: function(response) {
                // Update the temporary message with the real ID
                $(`[data-temp-id="${tempMessageId}"]`)
                    .removeClass('loading')
                    .attr('data-message-id', response.id)
                    .removeAttr('data-temp-id');
            },
            error: function(error) {
                console.error('Error sending message:', error);

                // Mark message as failed
                $(`[data-temp-id="${tempMessageId}"]`)
                    .removeClass('loading')
                    .addClass('failed');

                // Show retry button
                const $retryBtn = $('<button>')
                    .addClass('retry-btn')
                    .html('<i class="fas fa-redo"></i>')
                    .on('click', function() {
                        // Remove failed message
                        $(`[data-temp-id="${tempMessageId}"]`).remove();

                        // Try to send again
                        $('#chatInput').val(messageText);
                        if (selectedImage) {
                            $('#imagePreview').attr('src', selectedImage);
                            $('#imagePreviewContainer').show();
                        }
                        sendMessage();
                    });

                $(`[data-temp-id="${tempMessageId}"]`).append($retryBtn);
            }
        });
    }

    // Handle Send Button Click and Enter Key
    $('#sendBtn').on('click', sendMessage);
    $('#chatInput').on('keypress', function(e) {
        if (e.which === 13 && !$(this).hasClass('disabled')) {
            sendMessage();
        }
    });

    // Image Upload Handling
    $('#imageUpload').on('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();

            // Show loading indicator
            $('#loadingIndicator').fadeIn(200);

            reader.onload = function(e) {
                selectedImage = e.target.result;
                $('#imagePreview').attr('src', selectedImage);
                $('#imagePreviewContainer').slideDown(300);
                $('#loadingIndicator').fadeOut(200);

                // Disable text input when image is selected
                $('#chatInput')
                    .val('')
                    .attr('placeholder', 'Photo mode: Send photo only')
                    .addClass('disabled')
                    .prop('disabled', true);

                // Show mode indicator
                $('#modeIndicator').slideDown(300);
            };

            reader.readAsDataURL(file);
        }
    });

    // Remove Selected Image
    $('#removeImageBtn').on('click', removeSelectedImage);

    function removeSelectedImage() {
        selectedImage = null;
        $('#imagePreview').attr('src', '');
        $('#imagePreviewContainer').slideUp(300);
        $('#imageUpload').val('');

        // Re-enable text input
        $('#chatInput')
            .attr('placeholder', 'Type a message...')
            .removeClass('disabled')
            .prop('disabled', false);

        // Hide mode indicator
        $('#modeIndicator').slideUp(300);
    }

    // Image Modal
    $(document).on('click', '.message-image', function() {
        const imgSrc = $(this).attr('src');
        $('#enlargedImage').attr('src', imgSrc);
        $('#imageModal').fadeIn(300).css('display', 'flex');
    });

    $('#closeModal, #imageModal').on('click', function(e) {
        if (e.target !== $('#enlargedImage')[0]) {
            $('#imageModal').fadeOut(300);
        }
    });

    // Mark message as read
    function markMessageAsRead(chatId) {
        $.ajax({
            url: 'http://localhost:8082/api/v1/chat/read/' + chatId,
            method: 'PUT',
            error: function(error) {
                console.error('Error marking message as read:', error);
            }
        });
    }

    // Start polling for new messages
    function startMessagesPolling() {
        if (messagesPollingInterval) {
            clearInterval(messagesPollingInterval);
        }

        // Poll every 5 seconds
        messagesPollingInterval = setInterval(function() {
            if (currentAdId && currentReceiverId && loggedUserId) {
                checkNewMessages();
            }
        }, 5000);
    }

    // Stop polling for messages
    function stopMessagesPolling() {
        if (messagesPollingInterval) {
            clearInterval(messagesPollingInterval);
            messagesPollingInterval = null;
        }
    }

    // Check for new messages
    function checkNewMessages() {
        $.ajax({
            url: `http://localhost:8082/api/v1/chat/${loggedUserId}/${currentReceiverId}/${currentAdId}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // Get existing message IDs
                const existingMessageIds = $('.message').map(function() {
                    return $(this).attr('data-message-id');
                }).get();

                // Filter new messages
                const newMessages = response.filter(chat =>
                    !existingMessageIds.includes(chat.id) &&
                    chat.senderId !== loggedUserId
                );

                // Display new messages
                if (newMessages.length > 0) {
                    newMessages.forEach(function(chat) {
                        displayMessage(chat);
                    });
                    scrollToBottom();
                }
            },
            error: function(error) {
                console.error('Error checking for new messages:', error);
            }
        });
    }

    // Typing Indicator
    function showTypingIndicator() {
        $('#typingIndicator').show();
        scrollToBottom();
    }

    function hideTypingIndicator() {
        $('#typingIndicator').hide();
    }

    // Scroll to Bottom of Chat
    function scrollToBottom() {
        $('#chatBody').animate({ scrollTop: $('#chatBody')[0].scrollHeight }, 300);
    }
});