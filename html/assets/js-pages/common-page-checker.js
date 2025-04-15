
window.onload = function () {
    const loggedUser = localStorage.getItem("loggedInUserId");

    console.log("logged user: ", loggedUser);
    if (!loggedUser) {
        // Redirect to login page if not logged in
        window.location.href = "login.html"; // Change to your login page
    }
};