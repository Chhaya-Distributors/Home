document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-bar input");
    const vaccineItems = document.querySelectorAll(".dish");

    if (!searchInput || vaccineItems.length === 0) {
        alert("Search bar or dishes not found. Check your HTML structure.");
        return;
    }

    searchInput.addEventListener("keyup", () => {
        const searchValue = searchInput.value.toLowerCase();

        vaccineItems.forEach(item => {
            const title = item.querySelector("h3").textContent.toLowerCase();
            
            if (title.includes(searchValue)) {
                item.style.display = "block"; // Show matching items
            } else {
                item.style.display = "none"; // Hide non-matching items
            }
        });
    });
});
