document.addEventListener("DOMContentLoaded", function () {

    const grid =
        document.getElementById("savedGrid");

    if (!grid) {
        return;
    }


    grid.addEventListener("click", async function (event) {

        const button =
            event.target.closest(".saved-unsave-button");

        if (!button) {
            return;
        }

        const postId =
            button.dataset.postId;

        if (!postId) {
            return;
        }

        if (button.dataset.loading === "true") {
            return;
        }

        button.dataset.loading = "true";
        button.disabled = true;


        try {

            const response = await fetch(
                `/post/${postId}/save/`,
                {
                    method: "POST",

                    headers: {
                        "X-CSRFToken":
                            getCSRFToken(),

                        "X-Requested-With":
                            "XMLHttpRequest"
                    },

                    credentials: "same-origin"
                }
            );


            if (!response.ok) {
                throw new Error("Unsave request failed.");
            }


            const data =
                await response.json();


            /*
             * The endpoint toggles save state. If the post
             * is no longer saved, remove its card from the
             * grid. If somehow it's still saved (e.g. two
             * tabs open), just leave it and re-enable the
             * button.
             */

            if (!data.saved) {

                removeCard(postId);

            } else {

                button.dataset.loading = "false";
                button.disabled = false;

            }


        } catch (error) {

            console.error(
                "Unable to unsave post:",
                error
            );

            button.dataset.loading = "false";
            button.disabled = false;

        }

    });


    function removeCard(postId) {

        const card =
            document.getElementById(`saved-card-${postId}`);

        if (!card) {
            return;
        }

        card.classList.add("is-removing");

        card.addEventListener(
            "transitionend",
            function handleTransitionEnd() {

                card.removeEventListener(
                    "transitionend",
                    handleTransitionEnd
                );

                card.remove();

                updateSavedCount();

                maybeShowEmptyState();

            },
            { once: true }
        );

        /*
         * Fallback in case the transitionend event doesn't
         * fire for some reason (e.g. reduced motion).
         */

        setTimeout(function () {

            if (card.isConnected) {

                card.remove();

                updateSavedCount();

                maybeShowEmptyState();

            }

        }, 400);

    }


    function updateSavedCount() {

        const countEl =
            document.querySelector(".saved-header-count strong");

        if (!countEl) {
            return;
        }

        const remaining =
            grid.querySelectorAll(".saved-card").length;

        countEl.textContent = remaining;

    }


    function maybeShowEmptyState() {

        const remaining =
            grid.querySelectorAll(".saved-card").length;

        if (remaining > 0) {
            return;
        }

        grid.outerHTML = `
            <div class="saved-empty-state">

                <div class="saved-empty-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 3h12v18l-6-4-6 4z"/>
                    </svg>
                </div>

                <h4>No saved posts yet</h4>

                <p>Posts you save from Explore will show up here.</p>

                <a href="/explore/" class="saved-empty-cta">
                    Go to Explore →
                </a>

            </div>
        `;

    }


    /* =====================================================
       CSRF
       ===================================================== */

    function getCSRFToken() {

        const cookieValue =
            document.cookie
                .split("; ")
                .find(
                    row =>
                        row.startsWith("csrftoken=")
                );


        if (!cookieValue) {
            return "";
        }


        return decodeURIComponent(
            cookieValue.split("=")[1]
        );

    }

});
