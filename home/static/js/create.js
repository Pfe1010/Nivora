document.addEventListener("DOMContentLoaded", () => {

    const mediaInput = document.getElementById("id_media");
    const filePreview = document.getElementById("filePreview");
    const previewMedia = document.getElementById("previewMedia");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");
    const removeFile = document.getElementById("removeFile");

    const description = document.getElementById("id_description");
    const characterCount = document.getElementById("characterCount");


    // -------------------------
    // File Upload
    // -------------------------

    if (mediaInput) {

        mediaInput.addEventListener("change", () => {

            const file = mediaInput.files[0];

            if (!file) {
                return;
            }

            fileName.textContent = file.name;

            const sizeKB = Math.round(file.size / 1024);

            fileSize.textContent = `${sizeKB} KB`;

            previewMedia.innerHTML = "";

            const fileURL = URL.createObjectURL(file);


            if (file.type.startsWith("image/")) {

                const image = document.createElement("img");

                image.src = fileURL;
                image.alt = "Selected image";

                previewMedia.appendChild(image);

            } else if (file.type.startsWith("video/")) {

                const video = document.createElement("video");

                video.src = fileURL;
                video.controls = true;

                previewMedia.appendChild(video);
            }


            filePreview.classList.add("show");
        });
    }


    // -------------------------
    // Remove File
    // -------------------------

    if (removeFile) {

        removeFile.addEventListener("click", () => {

            mediaInput.value = "";

            previewMedia.innerHTML = "";

            fileName.textContent = "Selected file";
            fileSize.textContent = "0 KB";

            filePreview.classList.remove("show");
        });
    }


    // -------------------------
    // Character Counter
    // -------------------------

    if (description && characterCount) {

        const updateCounter = () => {

            characterCount.textContent =
                description.value.length;
        };


        description.addEventListener(
            "input",
            updateCounter
        );


        updateCounter();
    }

});