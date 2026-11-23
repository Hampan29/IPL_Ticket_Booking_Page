let toastTimer;

function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
    }

    toast.textContent = message;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
        toast.remove();
    }, 6000);
}

const menuToggle = document.querySelector(".menu-toggle");

if (menuToggle) {
    const navigation = document.querySelector(".site-nav");

    menuToggle.addEventListener("click", function () {
        const menuIsOpen = navigation.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", menuIsOpen);
    });

    const navigationLinks = navigation.querySelectorAll(".nav-link");

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navigation.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const teamFilter = document.getElementById("team-filter");
const matchCards = document.querySelectorAll(".match-card");
const matchList = document.getElementById("match-list");
const matchEmptyMessage = document.querySelector(".match-empty");
const viewButtons = document.querySelectorAll(".view-button");

if (teamFilter && matchList) {
    teamFilter.addEventListener("change", function () {
        let visibleMatchCount = 0;

        matchCards.forEach(function (card) {
            const teams = card.dataset.teams.split(" ");
            const teamMatches = teamFilter.value === "all" || teams.includes(teamFilter.value);

            card.hidden = !teamMatches;

            if (teamMatches) {
                visibleMatchCount = visibleMatchCount + 1;
            }
        });

        matchEmptyMessage.hidden = visibleMatchCount > 0;
    });
}

viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const listViewSelected = button.dataset.view === "list";

        matchList.classList.toggle("list-view", listViewSelected);

        viewButtons.forEach(function (viewButton) {
            const isSelected = viewButton === button;
            viewButton.classList.toggle("is-selected", isSelected);
            viewButton.setAttribute("aria-pressed", isSelected);
        });
    });
});

const bookLinks = document.querySelectorAll('a[href="#booking"]');

bookLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const bookingForm = document.querySelector(".booking-section");

        if (bookingForm) {
            bookingForm.scrollIntoView({
                behavior: "smooth"
            });

            showToast("Taking you to the ticket booking form.");
        }
    });
});

const matchSelect = document.getElementById("match");
const standSelect = document.getElementById("stand");
const quantityInput = document.getElementById("quantity");
const matchSummary = document.querySelector(".summary-match");
const standSummary = document.querySelector(".summary-stand");
const priceSummary = document.querySelector(".summary-price");
const quantitySummary = document.querySelector(".summary-quantity");
const totalSummary = document.querySelector(".summary-total");

if (
    matchSelect &&
    standSelect &&
    quantityInput &&
    matchSummary &&
    standSummary &&
    priceSummary &&
    quantitySummary &&
    totalSummary
) {
    const ticketPrices = {
        "Match 1": {
            General: 500,
            Premium: 1500,
            VIP: 3000
        },
        "Match 2": {
            General: 600,
            Premium: 1800,
            VIP: 3500
        },
        "Match 3": {
            General: 700,
            Premium: 2000,
            VIP: 4000
        }
    };

    function updateBookingSummary(showMessage) {
        const selectedMatch = matchSelect.value;
        const selectedStand = standSelect.value;
        const quantity = Number(quantityInput.value) || 0;

        let ticketPrice = 0;

        if (selectedMatch && selectedStand) {
            ticketPrice = ticketPrices[selectedMatch][selectedStand];
        }

        const totalPrice = ticketPrice * quantity;

        matchSummary.textContent = selectedMatch || "Not Selected";
        standSummary.textContent = selectedStand || "Not Selected";
        priceSummary.textContent = "₹" + ticketPrice.toLocaleString("en-IN");
        quantitySummary.textContent = quantity;
        totalSummary.textContent = "₹" + totalPrice.toLocaleString("en-IN");

        if (showMessage) {
            showToast("Booking summary updated.");
        }
    }

    matchSelect.addEventListener("change", function () {
        updateBookingSummary(true);
    });

    standSelect.addEventListener("change", function () {
        updateBookingSummary(true);
    });

    quantityInput.addEventListener("input", function () {
        updateBookingSummary(false);
    });

    quantityInput.addEventListener("change", function () {
        updateBookingSummary(true);
    });
}