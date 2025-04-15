$(document).ready(function() {

    const userRole = localStorage.getItem("role");
    const currentPath = window.location.pathname;

    if (userRole === "ADMIN" && !currentPath.includes("/admin/index.html")) {
        window.location.href = "http://localhost:63342/AAD-FRONTEND/admin/index.html";
    // } else if (userRole === "USER" && !currentPath.includes("/html/home.html")) {
    //     window.location.href = "http://localhost:63342/AAD-FRONTEND/html/home.html";
    } else if (userRole === "USER") {
        return;
    }


    else if (!userRole && !currentPath.includes("/html/login.html")) {
        window.location.href = "http://localhost:63342/AAD-FRONTEND/html/login.html";
    }

});
