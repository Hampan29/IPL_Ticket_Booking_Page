function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    document.body.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 3000);
}

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