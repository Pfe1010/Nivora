document.addEventListener("DOMContentLoaded", function () {

    const mediaInput =
        document.getElementById("id_media");

    const uploadArea =
        document.getElementById("uploadArea");

    const uploadTitle =
        document.getElementById("uploadTitle");

    const uploadText =
        document.getElementById("uploadText");

    const uploadSuccess =
        document.getElementById("uploadSuccess");

    const selectedFileName =
        document.getElementById("selectedFileName");

    const uploadError =
        document.getElementById("uploadError");

    const uploadErrorText =
        document.getElementById("uploadErrorText");

    const filePreview =
        document.getElementById("filePreview");

    const previewMedia =
        document.getElementById("previewMedia");

    const fileName =
        document.getElementById("fileName");

    const fileSize =
        document.getElementById("fileSize");

    const removeFile =
        document.getElementById("removeFile");

    const description =
        document.getElementById("id_description");

    const characterCount =
        document.getElementById("characterCount");


    /* =====================================================
       ALLOWED FILE TYPES
    ====================================================== */

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm"
    ];


    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".mp4",
        ".webm"
    ];


    /* =====================================================
       CHECK
    ====================================================== */

    if (!mediaInput) {

        console.error(
            "Nivora: #id_media was not found."
        );

        return;
    }


    /* =====================================================
       RESET
    ====================================================== */

    function resetUpload() {

        uploadArea.classList.remove(
            "has-file"
        );

        uploadArea.classList.remove(
            "dragging"
        );


        uploadSuccess.classList.remove(
            "show"
        );


        uploadError.classList.remove(
            "show"
        );


        filePreview.classList.remove(
            "show"
        );


        uploadTitle.textContent =
            "Choose an image or video";


        uploadText.textContent =
            "Click here to browse files";


        selectedFileName.textContent =
            "";


        fileName.textContent =
            "Selected file";


        fileSize.textContent =
            "0 KB";


        previewMedia.innerHTML =
            "";
    }


    /*
     * Always start clean.
     */

    resetUpload();


    /* =====================================================
       FILE SIZE
    ====================================================== */

    function formatFileSize(bytes) {

        if (bytes < 1024) {

            return bytes + " B";

        }


        if (bytes < 1024 * 1024) {

            return (
                (bytes / 1024).toFixed(1)
                + " KB"
            );

        }


        if (bytes < 1024 * 1024 * 1024) {

            return (
                (bytes / (1024 * 1024)).toFixed(1)
                + " MB"
            );

        }


        return (
            (bytes / (1024 * 1024 * 1024)).toFixed(1)
            + " GB"
        );
    }


    /* =====================================================
       GET EXTENSION
    ====================================================== */

    function getExtension(fileName) {

        const lastDot =
            fileName.lastIndexOf(".");


        if (lastDot === -1) {
            return "";
        }


        return fileName
            .substring(lastDot)
            .toLowerCase();
    }


    /* =====================================================
       VALIDATE FILE
    ====================================================== */

    function isValidFile(file) {

        if (!file) {
            return false;
        }


        const extension =
            getExtension(file.name);


        /*
         * Check both MIME type and extension.
         */

        const validMime =
            allowedMimeTypes.includes(
                file.type
            );


        const validExtension =
            allowedExtensions.includes(
                extension
            );


        return (
            validMime &&
            validExtension
        );
    }


    /* =====================================================
       SHOW ERROR
    ====================================================== */

    function showUploadError(file) {

        resetUpload();


        if (file) {

            const extension =
                getExtension(file.name);


            uploadErrorText.textContent =
                `"${file.name}" is not supported. Please select a JPG, PNG, WEBP, MP4 or WEBM file.`;

        } else {

            uploadErrorText.textContent =
                "Please select a JPG, PNG, WEBP, MP4 or WEBM file.";

        }


        uploadError.classList.add(
            "show"
        );
    }


    /* =====================================================
       PREVIEW
    ====================================================== */

    function showPreview(file) {

        previewMedia.innerHTML =
            "";


        if (
            file.type.startsWith(
                "image/"
            )
        ) {

            const image =
                document.createElement(
                    "img"
                );


            const objectURL =
                URL.createObjectURL(file);


            image.src =
                objectURL;


            image.alt =
                file.name;


            image.onload =
                function () {

                    URL.revokeObjectURL(
                        objectURL
                    );

                };


            previewMedia.appendChild(
                image
            );


            return;
        }


        if (
            file.type.startsWith(
                "video/"
            )
        ) {

            const video =
                document.createElement(
                    "video"
                );


            video.src =
                URL.createObjectURL(
                    file
                );


            video.muted =
                true;


            video.playsInline =
                true;


            video.preload =
                "metadata";


            previewMedia.appendChild(
                video
            );


            return;
        }
    }


    /* =====================================================
       HANDLE VALID FILE
    ====================================================== */

    function handleValidFile(file) {

        uploadError.classList.remove(
            "show"
        );


        uploadArea.classList.add(
            "has-file"
        );


        uploadTitle.textContent =
            "File selected";


        uploadText.textContent =
            "Click to choose another file";


        selectedFileName.textContent =
            file.name
            + " • "
            + formatFileSize(
                file.size
            );


        uploadSuccess.classList.add(
            "show"
        );


        fileName.textContent =
            file.name;


        fileSize.textContent =
            formatFileSize(
                file.size
            );


        showPreview(file);


        filePreview.classList.add(
            "show"
        );

    }


    /* =====================================================
       FILE INPUT
    ====================================================== */

    mediaInput.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files.length > 0
                    ? this.files[0]
                    : null;


            if (!file) {

                resetUpload();

                return;
            }


            /*
             * INVALID FILE
             */

            if (!isValidFile(file)) {

                /*
                 * Remove invalid file
                 * from the actual input.
                 */

                mediaInput.value =
                    "";


                showUploadError(
                    file
                );


                return;
            }


            /*
             * VALID FILE
             */

            handleValidFile(
                file
            );

        }
    );


    /* =====================================================
       REMOVE FILE
    ====================================================== */

    if (removeFile) {

        removeFile.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                mediaInput.value =
                    "";


                resetUpload();

            }
        );

    }


    /* =====================================================
       DRAG OVER
    ====================================================== */

    uploadArea.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();


            uploadArea.classList.add(
                "dragging"
            );

        }
    );


    /* =====================================================
       DRAG LEAVE
    ====================================================== */

    uploadArea.addEventListener(
        "dragleave",
        function () {

            uploadArea.classList.remove(
                "dragging"
            );

        }
    );


    /* =====================================================
       DROP
    ====================================================== */

    uploadArea.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();


            uploadArea.classList.remove(
                "dragging"
            );


            const files =
                event.dataTransfer.files;


            if (
                !files ||
                files.length === 0
            ) {

                return;
            }


            const file =
                files[0];


            /*
             * Validate BEFORE putting
             * the file into the input.
             */

            if (!isValidFile(file)) {

                mediaInput.value =
                    "";


                showUploadError(
                    file
                );


                return;
            }


            /*
             * Put valid file into
             * Django's actual input.
             */

            try {

                const dataTransfer =
                    new DataTransfer();


                dataTransfer.items.add(
                    file
                );


                mediaInput.files =
                    dataTransfer.files;

            } catch (error) {

                console.error(
                    "Could not assign dropped file:",
                    error
                );

                return;
            }


            handleValidFile(
                file
            );

        }
    );


    /* =====================================================
       CHARACTER COUNTER
    ====================================================== */

    if (
        description &&
        characterCount
    ) {

        function updateCharacterCount() {

            characterCount.textContent =
                description.value.length;

        }


        description.addEventListener(
            "input",
            updateCharacterCount
        );


        updateCharacterCount();

    }

});