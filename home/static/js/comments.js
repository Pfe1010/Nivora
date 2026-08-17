document.addEventListener("DOMContentLoaded", function () {

    /*
     * =====================================================
     * REPLY BUTTONS
     * =====================================================
     */

    const replyButtons = document.querySelectorAll(
        ".comment-reply-button"
    );

    replyButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const commentId = button.dataset.commentId;

            if (!commentId) {
                return;
            }

            const replyForm = document.getElementById(
                `reply-form-${commentId}`
            );

            if (!replyForm) {
                return;
            }

            /*
             * Close all other reply forms
             */

            document
                .querySelectorAll(".reply-form.is-visible")
                .forEach(function (form) {

                    if (form !== replyForm) {
                        form.classList.remove("is-visible");
                    }

                });


            /*
             * Toggle current reply form
             */

            replyForm.classList.toggle(
                "is-visible"
            );


            /*
             * Focus textarea
             */

            if (replyForm.classList.contains("is-visible")) {

                const textarea = replyForm.querySelector(
                    ".reply-textarea"
                );

                if (textarea) {
                    textarea.focus();
                }

            }

        });

    });


    /*
     * =====================================================
     * CANCEL REPLY
     * =====================================================
     */

    const cancelButtons = document.querySelectorAll(
        ".reply-cancel-button"
    );

    cancelButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const commentId = button.dataset.commentId;

            if (!commentId) {
                return;
            }

            const replyForm = document.getElementById(
                `reply-form-${commentId}`
            );

            if (!replyForm) {
                return;
            }

            replyForm.classList.remove(
                "is-visible"
            );

            const textarea = replyForm.querySelector(
                ".reply-textarea"
            );

            if (textarea) {
                textarea.value = "";
            }

        });

    });


    /*
     * =====================================================
     * PREVENT DOUBLE SUBMIT
     * =====================================================
     */

    const commentForms = document.querySelectorAll(
        ".comment-form, .reply-form"
    );

    commentForms.forEach(function (form) {

        form.addEventListener("submit", function () {

            const submitButton = form.querySelector(
                "button[type='submit']"
            );

            if (!submitButton) {
                return;
            }

            submitButton.disabled = true;

            submitButton.classList.add(
                "is-submitting"
            );

            submitButton.textContent = "Sending...";

        });

    });

});