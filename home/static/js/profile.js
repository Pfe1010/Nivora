document.addEventListener("DOMContentLoaded", function () {

    const avatarInput =
        document.getElementById("avatarInput");

    const avatarPreview =
        document.getElementById("avatarPreview");

    const usernameInput =
        document.getElementById("usernameInput");

    const usernameWrapper =
        usernameInput
            ? usernameInput.closest(".profile-username-wrapper")
            : null;

    const usernameStatus =
        document.getElementById("usernameStatus");

    const saveButton =
        document.getElementById("profileSaveButton");


    const originalUsername =
        usernameInput ? usernameInput.value.trim() : "";

    let usernameCheckTimer = null;
    let usernameIsValidForSubmit = true;


    /* =====================================================
       AVATAR PREVIEW
       ===================================================== */

    if (avatarInput && avatarPreview) {

        avatarInput.addEventListener("change", function () {

            const file =
                avatarInput.files && avatarInput.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                avatarPreview.innerHTML =
                    `<img src="${event.target.result}" alt="Avatar preview">`;

            };

            reader.readAsDataURL(file);

        });

    }


    /* =====================================================
       USERNAME LIVE CHECK
       ===================================================== */

    if (usernameInput && usernameWrapper && usernameStatus) {

        usernameInput.addEventListener("input", function () {

            const value =
                usernameInput.value.trim();


            clearTimeout(usernameCheckTimer);


            usernameWrapper.classList.remove(
                "is-taken",
                "is-available"
            );


            if (!value) {

                usernameStatus.textContent = "";
                usernameStatus.className =
                    "profile-username-status";

                usernameIsValidForSubmit = false;

                return;

            }


            if (value === originalUsername) {

                usernameStatus.textContent = "";
                usernameStatus.className =
                    "profile-username-status";

                usernameIsValidForSubmit = true;

                return;

            }


            usernameStatus.textContent = "Checking…";
            usernameStatus.className =
                "profile-username-status checking";

            usernameIsValidForSubmit = false;


            usernameCheckTimer = setTimeout(function () {

                checkUsername(value);

            }, 400);

        });

    }


    async function checkUsername(value) {

        try {

            const response = await fetch(
                `/profile/check-username/?username=${encodeURIComponent(value)}`,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },

                    credentials: "same-origin"
                }
            );


            if (!response.ok) {
                throw new Error("Username check failed.");
            }


            const data =
                await response.json();


            /*
             * Ignore stale responses if the user kept typing
             * after this request was sent.
             */

            if (usernameInput.value.trim() !== value) {
                return;
            }


            if (data.available) {

                usernameStatus.textContent = "Available";
                usernameStatus.className =
                    "profile-username-status available";

                usernameWrapper.classList.add("is-available");

                usernameIsValidForSubmit = true;

            } else {

                usernameStatus.textContent = "Taken";
                usernameStatus.className =
                    "profile-username-status taken";

                usernameWrapper.classList.add("is-taken");

                usernameIsValidForSubmit = false;

            }


        } catch (error) {

            console.error(
                "Unable to check username:",
                error
            );

            usernameStatus.textContent = "";
            usernameStatus.className =
                "profile-username-status";

        }

    }


    /* =====================================================
       PREVENT SUBMIT WHEN USERNAME IS TAKEN
       ===================================================== */

    const profileForm =
        document.getElementById("profileForm");

    if (profileForm) {

        profileForm.addEventListener("submit", function (event) {

            if (!usernameIsValidForSubmit) {

                event.preventDefault();

                if (usernameStatus) {

                    usernameStatus.textContent = "Taken";
                    usernameStatus.className =
                        "profile-username-status taken";

                }

                if (usernameWrapper) {
                    usernameWrapper.classList.add("is-taken");
                }

            }

        });

    }

});
