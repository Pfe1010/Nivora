document.addEventListener("DOMContentLoaded", function () {

    const likeButton =
        document.getElementById("exploreLikeButton");

    const likeCount =
        document.getElementById("exploreLikeCount");

    const saveButton =
        document.getElementById("exploreSaveButton");

    const shareButton =
        document.getElementById("exploreShareButton");


    /* =====================================================
       INITIAL LIKE STATE
       (color is based on the like COUNT, not on whether
        the current user liked it)
       ===================================================== */

    if (likeButton && likeCount) {

        const initialCount =
            parseInt(likeCount.textContent.trim(), 10) || 0;

        likeButton.classList.toggle(
            "is-liked",
            initialCount > 0
        );

    }


    /* =====================================================
       LIKE
       ===================================================== */

    if (likeButton && likeCount) {

        likeButton.addEventListener(
            "click",
            async function () {

                const postId =
                    likeButton.dataset.postId;

                if (!postId) {
                    return;
                }

                if (
                    likeButton.dataset.loading === "true"
                ) {
                    return;
                }

                likeButton.dataset.loading = "true";
                likeButton.disabled = true;


                try {

                    const response = await fetch(
                        `/post/${postId}/like/`,
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

                        throw new Error(
                            "Like request failed."
                        );

                    }


                    const data =
                        await response.json();


                    /*
                     * aria-pressed still reflects whether
                     * THIS user liked the post (accessibility).
                     */

                    likeButton.setAttribute(
                        "aria-pressed",
                        String(data.liked)
                    );


                    /*
                     * Visual color reflects the total like
                     * COUNT, not the current user's state.
                     */

                    likeButton.classList.toggle(
                        "is-liked",
                        data.count > 0
                    );


                    likeCount.textContent =
                        data.count;


                } catch (error) {

                    console.error(
                        "Unable to update like:",
                        error
                    );

                } finally {

                    likeButton.dataset.loading =
                        "false";

                    likeButton.disabled =
                        false;

                }

            }
        );

    }


    /* =====================================================
       SAVE
       ===================================================== */

    if (saveButton) {

        const initiallySaved =
            saveButton.getAttribute("aria-pressed") === "true";

        saveButton.classList.toggle(
            "is-saved",
            initiallySaved
        );


        saveButton.addEventListener(
            "click",
            async function () {

                const postId =
                    saveButton.dataset.postId;

                if (!postId) {
                    return;
                }

                if (
                    saveButton.dataset.loading === "true"
                ) {
                    return;
                }

                saveButton.dataset.loading = "true";
                saveButton.disabled = true;


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

                        throw new Error(
                            "Save request failed."
                        );

                    }


                    const data =
                        await response.json();


                    saveButton.setAttribute(
                        "aria-pressed",
                        String(data.saved)
                    );


                    saveButton.classList.toggle(
                        "is-saved",
                        data.saved
                    );


                } catch (error) {

                    console.error(
                        "Unable to update save:",
                        error
                    );

                } finally {

                    saveButton.dataset.loading =
                        "false";

                    saveButton.disabled =
                        false;

                }

            }
        );

    }


    /* =====================================================
       SHARE
       ===================================================== */

    if (shareButton) {

        shareButton.addEventListener(
            "click",
            async function () {

                const url =
                    window.location.href;


                /* ---------------------------------------------
                   Native Share
                   --------------------------------------------- */

                if (
                    navigator.share &&
                    typeof navigator.share === "function"
                ) {

                    try {

                        await navigator.share({
                            title: document.title,
                            text: "Check out this post on Nivora.",
                            url: url
                        });

                        return;

                    } catch (error) {

                        /*
                         * User cancelled native sharing.
                         */

                        if (
                            error &&
                            error.name === "AbortError"
                        ) {
                            return;
                        }

                    }

                }


                /* ---------------------------------------------
                   Clipboard API
                   --------------------------------------------- */

                if (
                    navigator.clipboard &&
                    typeof navigator.clipboard.writeText === "function"
                ) {

                    try {

                        await navigator.clipboard.writeText(
                            url
                        );

                        showShareFeedback();

                        return;

                    } catch (error) {

                        console.warn(
                            "Clipboard API failed.",
                            error
                        );

                    }

                }


                /* ---------------------------------------------
                   Fallback
                   --------------------------------------------- */

                fallbackCopy(url);

            }
        );

    }


    /* =====================================================
       SHARE FEEDBACK
       ===================================================== */

    function showShareFeedback() {

        if (!shareButton) {
            return;
        }


        const originalHTML =
            shareButton.innerHTML;


        shareButton.innerHTML = `
            <span class="explore-action-icon">
                ✓
            </span>

            <span>
                Copied
            </span>
        `;


        setTimeout(
            function () {

                shareButton.innerHTML =
                    originalHTML;

            },
            1800
        );

    }


    /* =====================================================
       COPY FALLBACK
       ===================================================== */

    function fallbackCopy(url) {

        const textarea =
            document.createElement("textarea");


        textarea.value = url;

        textarea.setAttribute(
            "readonly",
            ""
        );

        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";

        textarea.style.top =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.focus();
        textarea.select();


        let copied = false;


        try {

            copied =
                document.execCommand("copy");

        } catch (error) {

            copied = false;

        }


        document.body.removeChild(
            textarea
        );


        if (copied) {

            showShareFeedback();

        } else {

            console.error(
                "Unable to copy the post URL."
            );

        }

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
