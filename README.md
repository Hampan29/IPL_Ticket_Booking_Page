# IPL 2026 Ticket Booking

A simple IPL ticket booking website project built as a learning activity. It
brings match information, a ticket booking form, and helpful stadium guidelines
together in one easy-to-use page.

## About the Project

The website is a front-end demonstration of an IPL ticket booking experience.
Visitors can explore the match schedule, review ticket prices, fill in booking
details, view a live booking summary, and read ticket guidelines.

## Features

- IPL 2026 introduction, teams, and stadium venues
- Sample match schedule with venues and ticket prices
- Ticket booking form with match, stand, and ticket quantity fields
- Booking summary and bookings table layouts
- Ticket verification and stadium entry guidelines
- Responsive styling for desktop and smaller screens
- Live ticket price and total calculation with JavaScript
- A separate booking form page with built-in HTML validation
- Match cards with team filtering and grid/list views
- Mobile navigation with a toggle menu

## Built With

- HTML for the page content and form
- CSS for colors, responsive card layouts, and mobile styling
- JavaScript for match filtering, layout controls, navigation, notifications,
  smooth scrolling, and the live booking summary

## Project Files

```text
IPL_Ticket_Booking_Page/
├── index.html       # Main ticket booking page
├── booking.html     # Separate ticket booking form
├── css/
│   └── style.css    # Website styles
├── js/
│   └── app.js       # Original page interactions and booking summary
├── package.json     # React app scripts and dependencies
├── vite.config.js   # Runs Vite using src/ as the app root
└── src/
    ├── index.html   # Vite entry page; the original root index is unchanged
    ├── main.jsx     # Starts the React application
    ├── App.jsx      # Page layout, state, filtering, and booking logic
    ├── index.css    # React app styles
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Hero.jsx
    │   └── MatchCard.jsx
    └── data/
        └── matches.js
```

## Run the React App

1. Open a terminal in the project folder.
2. Run `npm install` to install React and Vite.
3. Run `npm run dev`.
4. Open the local URL shown in the terminal.

The original HTML page can still be opened separately using Live Server.

## Run the Original HTML Version

1. Download or clone this project.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a web browser.

You can also use the **Live Server** extension in VS Code to preview the page
while editing.

## Note

This project is a front-end learning activity. It does not connect to a server,
process real payments, or save bookings.
