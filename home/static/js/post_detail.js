document.addEventListener("DOMContentLoaded", function () {

    const likeButton =
        document.querySelector(".like-post-button");

    const likeCount =
        document.querySelector(".like-count");

    const likeLabel =
        likeButton
            ? likeButton.querySelector(".like-label")
            : null;


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


                    likeButton.setAttribute(
                        "aria-pressed",
                        String(data.liked)
                    );

                    likeButton.setAttribute(
                        "aria-label",
                        data.liked ? "Unlike post" : "Like post"
                    );


                    likeButton.classList.toggle(
                        "is-liked",
                        data.liked
                    );


                    if (likeLabel) {

                        likeLabel.textContent =
                            data.liked ? "Liked" : "Like";

                    }


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
