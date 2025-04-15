// chat.js

// Global variables
const loggedInUserId = localStorage.getItem('loggedInUserId');
let currentChatUser = null;
let currentAdId = null;
let lastMessageTimestamp = {};


$(document).ready(function() {


    // Initialize chat
    initialize();

    function initialize() {
        loadAdChats();
        setupEventListeners();
    }



    // step 2
    function loadAdChats() {
        if (!loggedInUserId) {
            console.error("User not logged in");
            return;
        }

        $.ajax({
            url: `http://localhost:8082/api/v1/chat/ads/${loggedInUserId}`,
            method: 'GET',
            success: function(adIds) {
                if (adIds && adIds.length > 0) {
                    // Clear existing chats list
                    $('.chat-users-list .chat-scroll').empty();

                    // Process each ad with chats
                    adIds.forEach(adId => {
                        fetchAdDetails(adId);
                    });
                } else {
                    $('.chat-users-list .chat-scroll').html('<div class="no-chats">No chats available</div>');
                }
            },
            error: function(error) {
                console.error("Error loading ad chats:", error);
            }
        });
    }




    // step 3
    function fetchAdDetails(adId) {
        if (!adId || adId === "undefined") {
            console.error("Invalid adId:", adId);
            return;
        }
        $.ajax({
            url: `http://localhost:8082/api/v1/ad/getAdDetailsByAdId/${adId}`,
            method: 'GET',
            success: function(ad) {
                // Check if the logged-in user is the ad owner/seller
                const isUserSeller = ad.userId === loggedInUserId;
                console.log("isUserSeller: " + isUserSeller);

                if (isUserSeller) {
                    // If the user is the seller, we need to find who they're chatting with
                    // Since there's no buyerId, we'll need to fetch all conversations for this ad
                    // and determine the other users from those conversations
                    fetchConversationParticipants(adId);
                } else {
                    // If the user is not the seller, then they're chatting with the ad owner
                    const otherUserId = ad.userId;
                    console.log("otherUserId (ad owner): " + otherUserId);
                    fetchUserDetails(otherUserId, ad);
                }
            },
            error: function(error) {
                console.error(`Error fetching ad details for ${adId}:`, error);
            }
        });
    }



    // function fetchAdDetails(adId) {
    //     if (!adId || adId === "undefined") {
    //         console.error("Invalid adId:", adId);
    //         return;
    //     }
    //     $.ajax({
    //         url: `http://localhost:8082/api/v1/ad/getAdDetailsByAdId/${adId}`,
    //         method: 'GET',
    //         success: function(ad) {
    //             // If this ad belongs to the logged-in user, we need to find all users
    //             // who have chatted with this user about this ad
    //             if (ad.userId === loggedInUserId) {
    //                 // Find all users who have chatted about this ad
    //                 $.ajax({
    //                     url: `http://localhost:8082/api/v1/chat/${loggedInUserId}/${loggedInUserId}/${adId}`,
    //                     method: 'GET',
    //                     success: function(messages) {
    //                         // Extract unique users from messages
    //                         const otherUserIds = new Set();
    //                         messages.forEach(msg => {
    //                             const otherUserId = msg.senderId === loggedInUserId ?
    //                                 msg.receiverId : msg.senderId;
    //                             if (otherUserId !== loggedInUserId) {
    //                                 otherUserIds.add(otherUserId);
    //                             }
    //                         });
    //
    //                         // For each unique user, fetch their details
    //                         otherUserIds.forEach(userId => {
    //                             fetchUserDetails(userId, ad);
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 // If the logged-in user is not the ad owner, then they're chatting with the owner
    //                 fetchUserDetails(ad.userId, ad);
    //             }
    //         },
    //         error: function(error) {
    //             console.error(`Error fetching ad details for ${adId}:`, error);
    //         }
    //     });
    // }






    function fetchConversationParticipants(adId) {
        // This function will get all users who have chatted about this ad with the logged-in user
        $.ajax({
            url: `http://localhost:8082/api/v1/chat/${loggedInUserId}/${adId}/participants`,
            method: 'GET',
            success: function(participants) {
                if (participants && participants.length > 0) {
                    // For each participant (other user who chatted about this ad)
                    participants.forEach(userId => {
                        // Get ad details again to pass to fetchUserDetails
                        $.ajax({
                            url: `http://localhost:8082/api/v1/ad/getAdDetailsByAdId/${adId}`,
                            method: 'GET',
                            success: function(ad) {
                                fetchUserDetails(userId, ad);
                            }
                        });
                    });
                }
            },
            error: function(error) {
                console.error(`Error fetching conversation participants for ad ${adId}:`, error);

                // Fallback: If the API doesn't exist, we can fetch all chats and filter
                $.ajax({
                    url: `http://localhost:8082/api/v1/chat/ads/${loggedInUserId}`,
                    method: 'GET',
                    success: function(adIds) {
                        // Check if this ad is in the list
                        if (adIds.includes(adId)) {
                            // We need to modify our backend to support getting all users for an ad
                            console.log("Found ad in chat list, but can't determine other users without additional API support");
                        }
                    }
                });
            }
        });
    }













    // step 4
    function fetchUserDetails(userId, ad) {

        if (!userId || userId === "undefined") {
            console.error("Invalid userId:", userId);
            return;
        }


        $.ajax({
            url: `http://localhost:8082/api/v1/user/${userId}`,
            method: 'GET',
            success: function(user) {
                // Fetch the last message for this conversation
                fetchLastMessage(loggedInUserId, userId, ad.id, function(lastMessage) {
                    // Create chat list item
                    createChatListItem(user, ad, lastMessage);
                });
            },
            error: function(error) {
                console.error(`Error fetching user details for ${userId}:`, error);
            }
        });
    }

    function fetchLastMessage(user1Id, user2Id, adId, callback) {
        $.ajax({
            url: `http://localhost:8082/api/v1/chat/${user1Id}/${user2Id}/${adId}`,
            method: 'GET',
            success: function(messages) {
                const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
                callback(lastMessage);
            },
            error: function(error) {
                console.error("Error fetching conversation:", error);
                callback(null);
            }
        });
    }







    // step 4
    function createChatListItem(user, ad, lastMessage) {
        // Get the first image from the ad for the avatar
        const adImage = ad.images && ad.images.length > 0 ? ad.images[0] : user.userImage;

        // Format the last message time
        const messageTime = lastMessage ? formatTimestamp(lastMessage.timestamp) : '';

        // Check if there are unread messages
        const unreadCount = countUnreadMessages(lastMessage);
        const unreadBadge = unreadCount > 0 ?
            `<div class="badge badge-success rounded-pill">${unreadCount}</div>` : '';

        // Create the chat list item HTML
        const chatItem = `
        <a href="javascript:void(0);" class="media d-flex" data-user-id="${user.id}" data-ad-id="${ad.id}">
            <div class="media-img-wrap flex-shrink-0">
                <div class="avatar avatar-online">
                    <img src="${ad.imageUrls[0]}" alt="Ad Image" class="avatar-img rounded-circle">
                </div>
            </div>
            <div class="media-body flex-grow-1">
                <div>
                    <div class="user-name">${user.name}</div>
                    <div class="user-last-chat">${lastMessage ? truncateMessage(lastMessage.message) : 'Start chatting'}</div>
                </div>
                <div>
                    <div class="last-chat-time block">${messageTime}</div>
                    ${unreadBadge}
                </div>
            </div>
        </a>
    `;

        // Append to the chat list
        $('.chat-users-list .chat-scroll').append(chatItem);
    }

    function countUnreadMessages(lastMessage) {
        // This would be enhanced to get actual unread count from your backend
        return lastMessage && lastMessage.status === 'SENT' && lastMessage.receiverId === loggedInUserId ? 1 : 0;
    }

    function truncateMessage(message) {
        // Check if message is a base64 image
        if (message.startsWith('data:image')) {
            return '[Image]';
        }
        return message.length > 25 ? message.substring(0, 25) + '...' : message;
    }

    function formatTimestamp(timestamp) {
        // Convert timestamp to "X min" format
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins < 1) {
            return 'now';
        } else if (diffMins < 60) {
            return `${diffMins} min`;
        } else if (diffMins < 1440) {
            return `${Math.floor(diffMins / 60)} hr`;
        } else {
            return `${Math.floor(diffMins / 1440)} day`;
        }
    }













    // step 5
    function setupEventListeners() {
        // Chat list item click event
        $(document).on('click', '.chat-users-list .media', function() {
            const userId = $(this).data('user-id');
            const adId = $(this).data('ad-id');

            // Set active chat
            $('.chat-users-list .media').removeClass('active');
            $(this).addClass('active');

            // Load conversation
            loadConversation(userId, adId);

            // Update current chat info
            currentChatUser = userId;
            currentAdId = adId;

            // Show chat window on mobile
            if ($(window).width() < 992) {
                $('.chat-cont-right').addClass('show');
            }
        });

        // Back button on mobile
        $('#back_user_list').on('click', function() {
            $('.chat-cont-right').removeClass('show');
        });

        // Send message button click
        $('.msg-send-btn').on('click', function() {
            sendMessage();
        });

        // Enter key in message input
        $('.input-msg-send').on('keypress', function(e) {
            if (e.which === 13) {
                sendMessage();
                return false;
            }
        });

        // File input change (for images)
        $('.btn-file input[type=file]').on('change', function() {
            const file = this.files[0];
            if (file && file.type.startsWith('image/')) {
                sendImage(file);
            } else {
                alert('Please select an image file');
            }
        });
    }


















    // step 6
    function loadConversation(userId, adId) {
        $.ajax({
            url: `http://localhost:8082/api/v1/chat/${loggedInUserId}/${userId}/${adId}`,
            method: 'GET',
            success: function(messages) {
                displayConversation(messages, userId);

                // Update chat header with user details
                updateChatHeader(userId);

                // Mark messages as read
                markMessagesAsRead(messages);
            },
            error: function(error) {
                console.error("Error loading conversation:", error);
            }
        });
    }

    function updateChatHeader(userId) {
        $.ajax({
            url: `http://localhost:8082/api/v1/user/${userId}`,
            method: 'GET',
            success: function(user) {
                $('.chat-header .user-name').text(user.name);

                // If you want to display ad image in the header as well
                if (currentAdId) {
                    $.ajax({
                        url: `http://localhost:8082/api/v1/ad/getAdDetailsByAdId/${currentAdId}`,
                        method: 'GET',
                        success: function(ad) {
                            const userImage =  user.userImage ? user.userImage : 'https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000';
                            $('.chat-header .avatar-img').attr('src', userImage);
                        }
                    });
                }
            }
        });
    }

    function markMessagesAsRead(messages) {
        messages.forEach(message => {
            if (message.receiverId === loggedInUserId && message.status === 'SENT') {
                $.ajax({
                    url: `http://localhost:8082/api/v1/chat/read/${message.id}`,
                    method: 'PUT'
                });
            }
        });
    }














    // step 7
    function displayConversation(messages, userId) {
        const chatBody = $('.chat-body .chat-scroll ul');
        chatBody.empty();

        let currentDate = '';

        messages.forEach(message => {
            const messageDate = new Date(message.timestamp).toLocaleDateString();

            // Add date separator if needed
            if (messageDate !== currentDate) {
                chatBody.append(`
                <li class="chat-date">${messageDate}</li>
            `);
                currentDate = messageDate;
            }

            // Determine if message is sent or received
            const isMessageSent = message.senderId === loggedInUserId;
            const messageClass = isMessageSent ? 'sent' : 'received';

            // Get user avatar (using ad image for now)
            const avatar = isMessageSent ? '' : `
            <div class="avatar flex-shrink-0">
                <img src="https://img.icons8.com/?size=100&id=IF3iw9cQfPOU&format=png&color=000000" alt="User Image" class="avatar-img rounded-circle">
            </div>
        `;

            // Check if message is an image
            let messageContent = '';
            if (message.message.startsWith('data:image')) {
                messageContent = `
                <div class="chat-msg-attachments">
                    <div class="chat-attachment">
                        <img src="${message.message}" alt="Attachment">
                        <a href="${message.message}" download="chat-image.jpg" class="chat-attach-download">
                            <i class="feather-download"></i>
                        </a>
                    </div>
                </div>
            `;
            } else {
                messageContent = `<p>${message.message}</p>`;
            }

            // Format timestamp
            const time = new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Create message HTML
            const messageHtml = `
            <li class="media d-flex ${messageClass}">
                ${avatar}
                <div class="media-body flex-grow-1">
                    <div class="msg-box">
                        <div>
                            ${messageContent}
                            <ul class="chat-msg-info">
                                <li>
                                    <div class="chat-time">
                                        <span>${time}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        `;

            chatBody.append(messageHtml);
        });

        // Scroll to bottom
        const chatScroll = $('.chat-body .chat-scroll');
        chatScroll.scrollTop(chatScroll[0].scrollHeight);
    }
















    // step 8

    function sendMessage() {
        if (!currentChatUser || !currentAdId) {
            alert('Please select a conversation first');
            return;
        }

        const messageInput = $('.input-msg-send');
        const message = messageInput.val().trim();

        if (message === '') {
            return;
        }

        // Create chat object
        const chatDTO = {
            message: message,
            status: 'SENT',
            senderId: loggedInUserId,
            receiverId: currentChatUser,
            adId: currentAdId
        };

        // Send message to server
        $.ajax({
            url: 'http://localhost:8082/api/v1/chat/save',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(chatDTO),
            success: function(savedChat) {
                // Clear input
                messageInput.val('');

                // Reload conversation
                loadConversation(currentChatUser, currentAdId);

                // Update chat list (to show latest message)
                updateChatListItem(currentChatUser, currentAdId, savedChat);
            },
            error: function(error) {
                console.error("Error sending message:", error);
                alert('Failed to send message. Please try again.');
            }
        });
    }

    function sendImage(file) {
        if (!currentChatUser || !currentAdId) {
            alert('Please select a conversation first');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;

            // Create chat object with image data
            const chatDTO = {
                message: base64Image,
                status: 'SENT',
                senderId: loggedInUserId,
                receiverId: currentChatUser,
                adId: currentAdId
            };

            // Send message to server
            $.ajax({
                url: 'http://localhost:8082/api/v1/chat/save',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(chatDTO),
                success: function(savedChat) {
                    // Clear file input
                    $('.btn-file input[type=file]').val('');

                    // Reload conversation
                    loadConversation(currentChatUser, currentAdId);

                    // Update chat list (to show latest message)
                    updateChatListItem(currentChatUser, currentAdId, savedChat);
                },
                error: function(error) {
                    console.error("Error sending image:", error);
                    alert('Failed to send image. Please try again.');
                }
            });
        };
        reader.readAsDataURL(file);
    }














    // step 9
    function updateChatListItem(userId, adId, lastMessage) {
        const chatItem = $(`.chat-users-list .media[data-user-id="${userId}"][data-ad-id="${adId}"]`);

        if (chatItem.length > 0) {
            // Update last message text
            chatItem.find('.user-last-chat').text(truncateMessage(lastMessage.message));

            // Update timestamp
            chatItem.find('.last-chat-time').text(formatTimestamp(lastMessage.timestamp));

            // Move to the top of the list
            chatItem.prependTo('.chat-users-list .chat-scroll');
        }

        // Refresh the unread badge count for other chats
        checkUnreadMessages();
    }

    function checkUnreadMessages() {
        $.ajax({
            url: `http://localhost:8082/api/v1/chat/unread/${loggedInUserId}`,
            method: 'GET',
            success: function(unreadMessages) {
                // Group unread messages by sender and ad
                const unreadCounts = {};

                unreadMessages.forEach(msg => {
                    const key = `${msg.senderId}_${msg.adId}`;
                    unreadCounts[key] = (unreadCounts[key] || 0) + 1;
                });

                // Update badges
                $('.chat-users-list .media').each(function() {
                    const userId = $(this).data('user-id');
                    const adId = $(this).data('ad-id');
                    const key = `${userId}_${adId}`;

                    const badgeContainer = $(this).find('.badge');

                    if (unreadCounts[key]) {
                        if (badgeContainer.length === 0) {
                            $(this).find('.last-chat-time').after(`
                            <div class="badge badge-success rounded-pill">${unreadCounts[key]}</div>
                        `);
                        } else {
                            badgeContainer.text(unreadCounts[key]);
                        }
                    } else {
                        badgeContainer.remove();
                    }
                });
            }
        });
    }

// Poll for new messages every 10 seconds
    setInterval(function() {
        if (currentChatUser && currentAdId) {
            loadConversation(currentChatUser, currentAdId);
        }
        checkUnreadMessages();
    }, 10000);












});



