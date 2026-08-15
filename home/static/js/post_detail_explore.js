document.addEventListener("DOMContentLoaded", function () {

    const likeButton =
        document.getElementById("exploreLikeButton");

    const commentButton =
        document.getElementById("exploreCommentButton");

    const saveButton =
        document.getElementById("exploreSaveButton");

    const shareButton =
        document.getElementById("exploreShareButton");


    /* =====================================================
       LIKE
       ===================================================== */

    if (likeButton) {

        likeButton.addEventListener("click", function () {

            const isLiked =
                likeButton.getAttribute("aria-pressed") === "true";


            likeButton.setAttribute(
                "aria-pressed",
                String(!isLiked)
            );


            likeButton.classList.toggle(
                "liked",
                !isLiked
            );

        });

    }


    /* =====================================================
       COMMENT
       ===================================================== */

    if (commentButton) {

        commentButton.addEventListener("click", function () {

            const commentSection =
                document.getElementById(
                    "exploreCommentSection"
                );


            if (commentSection) {

                commentSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                const commentInput =
                    document.getElementById(
                        "exploreCommentInput"
                    );


                if (commentInput) {

                    commentInput.focus();

                }

            }


            commentButton.classList.add(
                "comment-active"
            );


            setTimeout(function () {

                commentButton.classList.remove(
                    "comment-active"
                );

            }, 1200);

        });

    }


    /* =====================================================
       SAVE
       ===================================================== */

    if (saveButton) {

        saveButton.addEventListener("click", function () {

            const isSaved =
                saveButton.getAttribute("aria-pressed") === "true";


            saveButton.setAttribute(
                "aria-pressed",
                String(!isSaved)
            );


            saveButton.classList.toggle(
                "saved",
                !isSaved
            );

        });

    }


    /* =====================================================
       SHARE
       ===================================================== */

    if (shareButton) {

        shareButton.addEventListener(
            "click",
            async function () {

                const shareData = {

                    title: document.title,

                    text:
                        "Check out this post on Nivora.",

                    url:
                        window.location.href

                };


                /* -----------------------------------------
                   Native share
                   ----------------------------------------- */

                if (
                    navigator.share &&
                    typeof navigator.share === "function"
                ) {

                    try {

                        await navigator.share(
                            shareData
                        );

                    } catch (error) {

                        /*
                         * User cancelled sharing.
                         * Nothing to do.
                         */

                    }

                    return;
                }


                /* -----------------------------------------
                   Clipboard
                   ----------------------------------------- */

                if (
                    navigator.clipboard &&
                    navigator.clipboard.writeText
                ) {

                    try {

                        await navigator.clipboard.writeText(
                            window.location.href
                        );


                        showShareFeedback();

                    } catch (error) {

                        fallbackCopy();

                    }

                } else {

                    fallbackCopy();

                }

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

                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="m5 12 4 4L19 6"/>
                </svg>

            </span>

            <span>
                Copied
            </span>

        `;


        setTimeout(function () {

            shareButton.innerHTML =
                originalHTML;

        }, 1800);

    }


    /* =====================================================
       OLD BROWSER COPY FALLBACK
       ===================================================== */

    function fallbackCopy() {

        const textarea =
            document.createElement("textarea");


        textarea.value =
            window.location.href;


        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";

        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        try {

            document.execCommand("copy");

            showShareFeedback();

        } catch (error) {

            console.error(
                "Unable to copy URL."
            );

        }


        document.body.removeChild(
            textarea
        );

    }

});