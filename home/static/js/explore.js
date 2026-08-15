document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("exploreSidebarToggle");
    const sidebar = document.getElementById("exploreSidebar");
    const overlay = document.getElementById("exploreSidebarOverlay");

    if (!toggle || !sidebar || !overlay) {
        return;
    }


    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("visible");

        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");

        document.body.classList.add("explore-menu-open");
    }


    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("visible");

        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");

        document.body.classList.remove("explore-menu-open");
    }


    toggle.addEventListener("click", function () {

        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });


    overlay.addEventListener("click", function () {
        closeSidebar();
    });


    /*
     * Close sidebar after clicking a navigation link
     * on mobile/tablet.
     */
    const sidebarLinks = sidebar.querySelectorAll("a");

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 850) {
                closeSidebar();
            }

        });

    });


    /*
     * Close sidebar when resizing back to desktop.
     */
    window.addEventListener("resize", function () {

        if (window.innerWidth > 850) {
            closeSidebar();
        }

    });


    /*
     * Escape key closes the mobile menu.
     */
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeSidebar();
        }

    });

});