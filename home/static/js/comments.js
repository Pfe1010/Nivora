document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const textarea =
        document.getElementById("commentContent");

    const counter =
        document.getElementById("commentCounter");

    const form =
        document.getElementById("commentForm");

    const submitButton =
        document.getElementById("commentSubmit");

    const parentId =
        document.getElementById("parentId");

    const replyIndicator =
        document.getElementById("replyIndicator");

    const replyToUser =
        document.getElementById("replyToUser");

    const cancelReply =
        document.getElementById("cancelReply");

    const composerSubtitle =
        document.getElementById("composerSubtitle");


    const MAX_LENGTH = 255;



    /* =====================================================
       CHARACTER COUNTER
       ===================================================== */

    function updateCounter() {

        if (!textarea || !counter) {
            return;
        }

        const length =
            textarea.value.length;

        counter.textContent =
            `${length} / ${MAX_LENGTH}`;


        if (length >= MAX_LENGTH) {

            counter.classList.add(
                "limit-reached"
            );

        } else {

            counter.classList.remove(
                "limit-reached"
            );

        }

    }


    if (textarea) {

        textarea.addEventListener(
            "input",
            updateCounter
        );

        updateCounter();

    }



    /* =====================================================
       START REPLY
       ===================================================== */

    function startReply(commentId, username) {

        if (!parentId) {
            return;
        }


        /*
         * Set parent comment ID
         */

        parentId.value =
            commentId;


        /*
         * Show reply indicator
         */

        if (replyIndicator) {

            replyIndicator.classList.add(
                "active"
            );

        }


        /*
         * Show username
         */

        if (replyToUser) {

            replyToUser.textContent =
                `@${username}`;

        }


        /*
         * Change composer subtitle
         */

        if (composerSubtitle) {

            composerSubtitle.textContent =
                `Replying to ${username}`;

        }


        /*
         * Change placeholder
         */

        if (textarea) {

            textarea.placeholder =
                `Reply to ${username}...`;

            textarea.focus();

        }


        /*
         * Scroll to composer
         */

        const composer =
            document.querySelector(
                ".comment-composer"
            );

        if (composer) {

            composer.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }



    /* =====================================================
       CANCEL REPLY
       ===================================================== */

    function resetReply() {

        if (parentId) {

            parentId.value = "";

        }


        if (replyIndicator) {

            replyIndicator.classList.remove(
                "active"
            );

        }


        if (composerSubtitle) {

            composerSubtitle.textContent =
                "Join the discussion";

        }


        if (textarea) {

            textarea.placeholder =
                "Write a comment...";

        }

    }


    if (cancelReply) {

        cancelReply.addEventListener(
            "click",
            resetReply
        );

    }



    /* =====================================================
       REPLY BUTTONS
       ===================================================== */

    const replyButtons =
        document.querySelectorAll(
            ".reply-button"
        );


    replyButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const commentId =
                    this.dataset.commentId;

                const username =
                    this.dataset.commentUser;


                if (!commentId) {
                    return;
                }


                startReply(
                    commentId,
                    username
                );

            }
        );

    });



    /* =====================================================
       VIEW REPLIES
       ===================================================== */

    const viewRepliesButtons =
        document.querySelectorAll(
            ".view-replies-button"
        );


    viewRepliesButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        this.dataset.target;

                    const replies =
                        document.getElementById(
                            targetId
                        );


                    if (!replies) {
                        return;
                    }


                    const isHidden =
                        replies.hasAttribute(
                            "hidden"
                        );


                    if (isHidden) {

                        /*
                         * OPEN
                         */

                        replies.removeAttribute(
                            "hidden"
                        );

                        this.setAttribute(
                            "aria-expanded",
                            "true"
                        );


                        this.querySelector(
                            "span:first-child"
                        ).textContent =
                            "Hide";


                    } else {

                        /*
                         * CLOSE
                         */

                        replies.setAttribute(
                            "hidden",
                            ""
                        );

                        this.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        this.querySelector(
                            "span:first-child"
                        ).textContent =
                            "View";

                    }

                }
            );

        }
    );



    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                const content =
                    textarea
                        ? textarea.value.trim()
                        : "";


                /*
                 * Empty comment
                 */

                if (!content) {

                    event.preventDefault();

                    if (textarea) {

                        textarea.focus();

                    }

                    return;

                }


                /*
                 * Maximum length
                 */

                if (
                    content.length >
                    MAX_LENGTH
                ) {

                    event.preventDefault();

                    if (textarea) {

                        textarea.focus();

                    }

                    return;

                }


                /*
                 * Prevent double submit
                 */

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML =
                        `
                        <span>
                            Posting...
                        </span>
                        `;

                }

            }
        );

    }

});