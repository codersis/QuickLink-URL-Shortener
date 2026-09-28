const API_BASE_URL = "http://127.0.0.1:8001";

// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const urlList = document.getElementById("url-list");
const searchInput = document.getElementById("search-input");
const refreshBtn = document.getElementById("refresh-btn");
const dashboardError = document.getElementById("dashboard-error");

// Summary cards
const totalURLsElement = document.getElementById("total-urls");
const totalClicksElement = document.getElementById("total-clicks");

const mostClickedCountElement = document.getElementById(
    "most-clicked-count"
);

const mostClickedURLElement = document.getElementById(
    "most-clicked-url"
);

// Store URLs fetched from the backend
let allURLs = [];


// ========================================
// 2. HELPER FUNCTIONS
// ========================================

// Display an error message safely
function showError(element, message) {
    element.textContent = message;
    element.classList.remove("hidden");
}

// Hide an error message
function hideError(element) {
    element.classList.add("hidden");
    element.textContent = "";
}

// Format date and time
function formatDate(dateString) {

    if (!dateString) {
        return "Not available";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString();
}

// Create a table cell
function createCell(text) {

    const cell = document.createElement("td");
    cell.textContent = text ?? "";

    return cell;
}


// ========================================
// 3. COPY URL HELPER
// ========================================

async function copyURL(url, button) {

    if (!url) {
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
            dashboardError,
            "Unable to copy. Please copy the link manually."
        );
    }
}


// ========================================
// 4. LOAD URLS FROM BACKEND
// ========================================

async function loadURLs() {

    urlList.replaceChildren();

    const loadingRow = document.createElement("tr");
    const loadingCell = document.createElement("td");

    loadingCell.colSpan = 5;
    loadingCell.textContent = "Loading URLs...";

    loadingRow.appendChild(loadingCell);
    urlList.appendChild(loadingRow);

    hideError(dashboardError);

    refreshBtn.disabled = true;

    try {

        const response = await fetch(
            `${API_BASE_URL}/urls`
        );

        if (!response.ok) {
            throw new Error("Failed to load URLs.");
        }

        const urls = await response.json();

        // Store all URLs
        allURLs = Array.isArray(urls) ? urls : [];

        // Update summary cards using ALL URLs
        updateSummaryCards(allURLs);

        // Display URLs according to search
        searchURLs();

    } catch (error) {

        showError(
            dashboardError,
            error.message || "Unable to load URLs."
        );

        urlList.replaceChildren();

        // Reset summary cards if dashboard cannot load
        updateSummaryCards([]);

    } finally {

        refreshBtn.disabled = false;
    }
}


// ========================================
// 5. UPDATE SUMMARY CARDS
// ========================================

function updateSummaryCards(urls) {

    // Total shortened URLs
    const totalURLs = urls.length;

    totalURLsElement.textContent = totalURLs;


    // Total clicks across all URLs
    const totalClicks = urls.reduce(
        (sum, url) => sum + Number(url.click_count || 0),
        0
    );

    totalClicksElement.textContent = totalClicks;


    // Find the most-clicked URL
    if (urls.length === 0) {

        mostClickedCountElement.textContent = "0";
        mostClickedURLElement.textContent = "No URLs yet";

        return;
    }

    const mostClickedURL = urls.reduce(
        (max, url) => {

            return Number(url.click_count || 0) >
                Number(max.click_count || 0)
                ? url
                : max;
        },
        urls[0]
    );

    const highestClicks = Number(
        mostClickedURL.click_count || 0
    );

    mostClickedCountElement.textContent = highestClicks;

    if (highestClicks === 0) {

        mostClickedURLElement.textContent = "No clicks yet";

    } else {

        mostClickedURLElement.textContent =
            mostClickedURL.short_code;
    }
}


// ========================================
// 6. DISPLAY URLS IN DASHBOARD
// ========================================

function renderURLs(urls) {

    urlList.replaceChildren();

    // Handle empty results
    if (urls.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;

        if (allURLs.length === 0) {

            cell.textContent = "No shortened URLs yet.";

        } else {

            cell.textContent = "No matching URLs found.";
        }

        row.appendChild(cell);
        urlList.appendChild(row);

        return;
    }

    // Create one row for every URL
    urls.forEach(function (url) {

        const row = document.createElement("tr");


        // ORIGINAL URL

        const originalCell = document.createElement("td");
        const originalLink = document.createElement("a");

        originalLink.href = url.original_url;
        originalLink.textContent = url.original_url;
        originalLink.target = "_blank";
        originalLink.rel = "noopener noreferrer";

        originalCell.appendChild(originalLink);


        // SHORT URL

        const shortCell = document.createElement("td");
        const shortLink = document.createElement("a");

        shortLink.href = url.short_url;
        shortLink.textContent = url.short_url;
        shortLink.target = "_blank";
        shortLink.rel = "noopener noreferrer";

        shortCell.appendChild(shortLink);


        // CLICK COUNT

        const clicksCell = createCell(
            Number(url.click_count || 0)
        );


        // CREATION DATE

        const dateCell = createCell(
            formatDate(url.created_at)
        );


        // ACTION BUTTONS

        const actionCell = document.createElement("td");

        const actionButtons = document.createElement("div");

        actionButtons.classList.add("action-buttons");


        // COPY BUTTON

        const copyURLBtn = document.createElement("button");

        copyURLBtn.textContent = "Copy";
        copyURLBtn.classList.add("copy-link-btn");
        copyURLBtn.type = "button";

        copyURLBtn.addEventListener("click", function () {

            copyURL(url.short_url, copyURLBtn);

        });


        // DELETE BUTTON

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.type = "button";

        deleteBtn.addEventListener("click", function () {

            deleteURL(url.short_code);

        });


        // Add ONLY Copy and Delete buttons
        actionButtons.append(
            copyURLBtn,
            deleteBtn
        );

        actionCell.appendChild(actionButtons);


        // ADD ALL CELLS TO THE ROW

        row.append(
            originalCell,
            shortCell,
            clicksCell,
            dateCell,
            actionCell
        );

        urlList.appendChild(row);
    });
}


// ========================================
// 7. SEARCH URLS
// ========================================

function searchURLs() {

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    const filteredURLs = allURLs.filter(function (url) {

        return (

            (url.original_url || "")
                .toLowerCase()
                .includes(searchTerm) ||

            (url.short_code || "")
                .toLowerCase()
                .includes(searchTerm) ||

            (url.short_url || "")
                .toLowerCase()
                .includes(searchTerm)

        );
    });

    renderURLs(filteredURLs);
}


// Search as the user types
searchInput.addEventListener(
    "input",
    searchURLs
);


// ========================================
// 8. REFRESH DASHBOARD
// ========================================

refreshBtn.addEventListener(
    "click",
    loadURLs
);


// ========================================
// 9. DELETE URL
// ========================================

async function deleteURL(shortCode) {

    const confirmed = confirm(
        "Are you sure you want to delete this shortened URL?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/${encodeURIComponent(shortCode)}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {

            const data = await response.json().catch(() => ({}));

            throw new Error(
                data.detail || "Failed to delete URL."
            );
        }

        alert("URL deleted successfully!");

        // Refresh dashboard and summary cards
        await loadURLs();

    } catch (error) {

        showError(
            dashboardError,
            error.message || "Unable to delete URL."
        );
    }
}


// ========================================
// 10. LOAD DASHBOARD WHEN PAGE OPENS
// ========================================

loadURLs();