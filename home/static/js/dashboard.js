document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("dashboardSidebar");
    const toggle = document.getElementById("sidebarToggle");
    const overlay = document.getElementById("sidebarOverlay");


    if (!sidebar || !toggle || !overlay) {
        return;
    }


    function openSidebar() {

        sidebar.classList.add("is-open");

        overlay.classList.add("is-visible");

        toggle.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.style.overflow = "hidden";
    }


    function closeSidebar() {

        sidebar.classList.remove("is-open");

        overlay.classList.remove("is-visible");

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.style.overflow = "";
    }


    toggle.addEventListener(
        "click",
        function () {

            if (
                sidebar.classList.contains("is-open")
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        }
    );


    overlay.addEventListener(
        "click",
        closeSidebar
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeSidebar();
            }

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 760) {
                closeSidebar();
            }

        }
    );

});