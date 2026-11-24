import { useState } from 'react'

function Navbar({ bookedTicketCount = 0 }) {
  // This state tracks whether the mobile navigation is open.
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  function handleMenuToggle() {
    setMenuIsOpen(!menuIsOpen)
  }

  function handleNavigationClick() {
    setMenuIsOpen(false)
  }

  return (
    <header className="site-header">
      <a className="site-logo" href="#home" onClick={handleNavigationClick}>
        IPL 2026
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuIsOpen}
        aria-controls="main-navigation"
        onClick={handleMenuToggle}
      >
        <span className="menu-toggle-label">Menu</span>
        <span aria-hidden="true">{menuIsOpen ? '×' : '☰'}</span>
      </button>

      <nav
        className={menuIsOpen ? 'site-nav is-open' : 'site-nav'}
        id="main-navigation"
      >
        <ul>
          <li><a className="nav-link" href="#matches" onClick={handleNavigationClick}>Matches</a></li>
          <li><a className="nav-link" href="#booking" onClick={handleNavigationClick}>Book Ticket</a></li>
          <li><a className="nav-link" href="#my-bookings" onClick={handleNavigationClick}>My Bookings</a></li>
          <li><a className="nav-link" href="#guidelines" onClick={handleNavigationClick}>Guidelines</a></li>
        </ul>
      </nav>

      <p className="ticket-count" aria-live="polite">
        Tickets booked: {bookedTicketCount}
      </p>
    </header>
  )
}

export default Navbar
