const API_BASE_URL = "http://127.0.0.1:8001";

// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const form = document.getElementById("shorten-form");
const urlInput = document.getElementById("url-input");
const shortenBtn = document.getElementById("shorten-btn");

const result = document.getElementById("result");
const shortUrl = document.getElementById("short-url");
const copyBtn = document.getElementById("copy-btn");
const errorMessage = document.getElementById("error-message");


// ========================================
// 2. HELPER FUNCTIONS
// ========================================

function showError(element, message) {
    element.textContent = message;
    element.classList.remove("hidden");
}

function hideError(element) {
    element.classList.add("hidden");
    element.textContent = "";
}


// ========================================
// 3. HANDLE URL SHORTENING
// ========================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const originalUrl = urlInput.value.trim();

    hideError(errorMessage);
    result.classList.add("hidden");

    if (!originalUrl) {

        showError(
            errorMessage,
            "Please enter a URL."
        );

        return;
    }

    shortenBtn.disabled = true;
    shortenBtn.textContent = "Shortening...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/shorten`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: originalUrl
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            const message = Array.isArray(data.detail)
                ? data.detail.map(error => error.msg).join(", ")
                : data.detail || "Failed to shorten URL.";

            throw new Error(message);
        }

        // Display the shortened URL
        shortUrl.textContent = data.short_url;
        shortUrl.href = data.short_url;

        // Show the result section
        result.classList.remove("hidden");

        // Reset the Copy button
        copyBtn.textContent = "Copy";
        copyBtn.disabled = false;

        // Clear the input field
        urlInput.value = "";

    } catch (error) {

        showError(
            errorMessage,
            error.message || "Unable to connect to the server."
        );

    } finally {

        shortenBtn.disabled = false;
        shortenBtn.textContent = "Shorten URL";
    }
});


// ========================================
// 4. COPY NEWLY CREATED SHORT URL
// ========================================

copyBtn.addEventListener("click", async function () {

    await copyURL(shortUrl.href, copyBtn);

});


// ========================================
// 5. COPY URL HELPER
// ========================================

async function copyURL(url, button) {

    if (!url || url === window.location.href + "#") {
        return;
    }

    const originalText = button.textContent;

    try {

        await navigator.clipboard.writeText(url);

        button.textContent = "Copied!";
        button.disabled = true;

        setTimeout(() => {

            button.textContent = originalText;
            button.disabled = false;

        }, 1500);

    } catch (error) {

        showError(
            errorMessage,
            "Unable to copy. Please copy the link manually."
        );
    }
}