document.addEventListener("DOMContentLoaded", function () {

    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("dashboardSidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (!sidebarToggle || !sidebar || !overlay) {
        return;
    }


    function openSidebar() {

        sidebar.classList.add("sidebar-open");
        overlay.classList.add("overlay-open");

        sidebarToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        sidebarToggle.setAttribute(
            "aria-label",
            "Close menu"
        );

        document.body.classList.add("dashboard-menu-open");
    }


    function closeSidebar() {

        sidebar.classList.remove("sidebar-open");
        overlay.classList.remove("overlay-open");

        sidebarToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        sidebarToggle.setAttribute(
            "aria-label",
            "Open menu"
        );

        document.body.classList.remove("dashboard-menu-open");
    }


    sidebarToggle.addEventListener("click", function () {

        if (sidebar.classList.contains("sidebar-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });


    overlay.addEventListener("click", function () {
        closeSidebar();
    });


    sidebar.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            closeSidebar();
        });

    });


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeSidebar();
        }

    });


    window.addEventListener("resize", function () {

        if (window.innerWidth > 800) {
            closeSidebar();
        }

    });

});