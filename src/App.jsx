import { useEffect, useState } from 'react'
import Hero from './components/Hero.jsx'
import MatchCard from './components/MatchCard.jsx'
import Navbar from './components/Navbar.jsx'
import { supabase } from './supabase.js'

const TEAM_CODES = {
  'Royal Challengers Bengaluru': 'RCB',
  'Chennai Super Kings': 'CSK',
  'Mumbai Indians': 'MI',
  'Kolkata Knight Riders': 'KKR',
  'Sunrisers Hyderabad': 'SRH',
  'Rajasthan Royals': 'RR',
  'Delhi Capitals': 'DC',
  'Punjab Kings': 'PBKS',
  'Lucknow Super Giants': 'LSG',
  'Gujarat Titans': 'GT',
}

function formatPrice(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

// Converts a row from Supabase's 'matches' table into the shape our UI components expect
function formatMatchFromDB(row, index) {
  const basePrice = Number(row.price || 1000)
  return {
    id: row.id,
    matchNumber: `Match ${index + 1}`,
    team1: row.team1,
    team1Code: TEAM_CODES[row.team1] || row.team1.slice(0, 3).toUpperCase(),
    team2: row.team2,
    team2Code: TEAM_CODES[row.team2] || row.team2.slice(0, 3).toUpperCase(),
    venue: row.venue,
    date: row.match_date,
    available_seats: row.available_seats ?? 100,
    prices: {
      General: basePrice,
      Premium: basePrice * 2,
      VIP: basePrice * 4,
    },
  }
}

function App() {
  // Live matches fetched from Supabase PostgreSQL
  const [matches, setMatches] = useState([])
  const [isLoadingMatches, setIsLoadingMatches] = useState(true)

  // UI filter, form, and booking states
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [matchView, setMatchView] = useState('grid')
  const [selectedMatchId, setSelectedMatchId] = useState('')
  const [selectedStand, setSelectedStand] = useState('General')
  const [quantity, setQuantity] = useState(1)
  const [seatPreference, setSeatPreference] = useState('No preference')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [bookings, setBookings] = useState([])
  const [bookedTicketCount, setBookedTicketCount] = useState(0)
  const [toastMessage, setToastMessage] = useState('')

  // Build unique teams and venues lists dynamically from the live database matches
  const teamsMap = new Map()
  matches.forEach(function (match) {
    teamsMap.set(match.team1Code, { code: match.team1Code, name: match.team1 })
    teamsMap.set(match.team2Code, { code: match.team2Code, name: match.team2 })
  })
  const teams = Array.from(teamsMap.values())
  const venues = Array.from(new Set(matches.map(function (match) { return match.venue })))

  const selectedMatch = matches.find(function (match) {
    return match.id === selectedMatchId
  }) || null

  const ticketPrice = selectedMatch && selectedMatch.prices
    ? Number(selectedMatch.prices[selectedStand] || 0)
    : 0
  const totalPrice = ticketPrice * quantity

  const filteredMatches = matches.filter(function (match) {
    if (selectedTeam === 'all') {
      return true
    }
    return match.team1Code === selectedTeam || match.team2Code === selectedTeam
  })

  // STEP 3 & STEP 5: Fetch matches from Supabase and subscribe to realtime updates
  useEffect(function () {
    async function fetchMatches() {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error fetching matches from Supabase:', error.message)
        setToastMessage('Could not load matches from database.')
      } else {
        console.log('Loaded matches from Supabase:', data)
        const formatted = (data || []).map(formatMatchFromDB)
        setMatches(formatted)
        if (formatted.length > 0) {
          setSelectedMatchId(function (prevId) {
            return prevId === '' ? formatted[0].id : prevId
          })
        }
      }
      setIsLoadingMatches(false)
    }

    fetchMatches()

    const channel = supabase
      .channel('matches-realtime-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        function (payload) {
          console.log('Realtime database update:', payload)

          if (payload.eventType === 'UPDATE') {
            setMatches(function (prevMatches) {
              return prevMatches.map(function (item, idx) {
                return item.id === payload.new.id
                  ? formatMatchFromDB(payload.new, idx)
                  : item
              })
            })
          } else if (payload.eventType === 'INSERT') {
            setMatches(function (prevMatches) {
              return [...prevMatches, formatMatchFromDB(payload.new, prevMatches.length)]
            })
          } else if (payload.eventType === 'DELETE') {
            setMatches(function (prevMatches) {
              return prevMatches.filter(function (item) {
                return item.id !== payload.old.id
              })
            })
          }
        }
      )
      .subscribe()

    return function () {
      supabase.removeChannel(channel)
    }
  }, [])

  // Auto-hide toast notifications after 4 seconds
  useEffect(function () {
    if (toastMessage === '') {
      return undefined
    }

    const timerId = window.setTimeout(function () {
      setToastMessage('')
    }, 4000)

    return function () {
      window.clearTimeout(timerId)
    }
  }, [toastMessage])

  function handleTeamFilter(event) {
    setSelectedTeam(event.target.value)
  }

  function handleGridView() {
    setMatchView('grid')
  }

  function handleListView() {
    setMatchView('list')
  }

  function handleSelectMatch(matchId) {
    setSelectedMatchId(Number(matchId))
    setToastMessage('Match selected. Choose a stand and ticket quantity.')
  }

  function handleBookingMatchChange(event) {
    handleSelectMatch(Number(event.target.value))
  }

  function handleStandChange(event) {
    setSelectedStand(event.target.value)
  }

  function handleSeatPreferenceChange(event) {
    setSeatPreference(event.target.value)
  }

  function handleQuantityChange(event) {
    const newQuantity = Number(event.target.value)
    setQuantity(newQuantity)
  }

  function handleNameChange(event) {
    setCustomerName(event.target.value)
  }

  function handleEmailChange(event) {
    setCustomerEmail(event.target.value)
  }

  function handlePhoneChange(event) {
    setCustomerPhone(event.target.value)
  }

  // STEP 4: Insert booking into 'bookings' and update 'available_seats' in 'matches'
  async function handleBookTicket(event) {
    event.preventDefault()

    if (!selectedMatch) {
      setToastMessage('There are no matches available to book.')
      return
    }

    if (selectedMatch.available_seats < quantity) {
      setToastMessage(`Only ${selectedMatch.available_seats} seats left for this match.`)
      return
    }

    // 1. Insert new row into Supabase 'bookings' table
    const { data: insertedRows, error: insertError } = await supabase
      .from('bookings')
      .insert([
        {
          match_id: selectedMatch.id,
          customer_name: customerName,
          seats_booked: quantity,
          total_amount: totalPrice,
        },
      ])
      .select()

    if (insertError) {
      console.error('Supabase insert error:', insertError.message)
      setToastMessage('Booking failed: ' + insertError.message)
      return
    }

    // 2. Subtract booked seats in Supabase 'matches' table
    const updatedSeats = selectedMatch.available_seats - quantity

    const { error: updateError } = await supabase
      .from('matches')
      .update({ available_seats: updatedSeats })
      .eq('id', selectedMatch.id)

    if (updateError) {
      console.error('Supabase update error:', updateError.message)
      setToastMessage('Booking saved, but failed to update available seats.')
      return
    }

    const dbBookingId = insertedRows && insertedRows[0]
      ? `IPL-${insertedRows[0].id}`
      : `IPL-${bookings.length + 1}`

    const newBooking = {
      id: dbBookingId,
      matchNumber: selectedMatch.matchNumber,
      teams: `${selectedMatch.team1} vs ${selectedMatch.team2}`,
      stand: selectedStand,
      seatPreference: seatPreference,
      quantity: quantity,
      total: totalPrice,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
    }

    setBookings([newBooking, ...bookings])
    setBookedTicketCount(bookedTicketCount + quantity)
    console.log('Booked & saved to PostgreSQL:', dbBookingId, selectedMatch.team1, selectedMatch.team2)
    setToastMessage('Your ticket booking has been saved to Supabase!')
  }

  function handleToastClose() {
    setToastMessage('')
  }

  return (
    <>
      <Navbar bookedTicketCount={bookedTicketCount} />

      <main className="page-content">
        <Hero />

        <section className="content-section about-section" id="about">
          <h2>About IPL 2026</h2>
          <p>
            The Indian Premier League (IPL) is a professional Twenty20 cricket
            league featuring teams representing different cities across India.
          </p>

          <h3>Popular Teams</h3>
          <ul className="about-list">
            {teams.map(function (team) {
              return <li key={team.code}>{team.name} ({team.code})</li>
            })}
          </ul>

          <h3>Major Match Venues</h3>
          <ul className="about-list">
            {venues.map(function (venue) {
              return <li key={venue}>{venue}</li>
            })}
          </ul>
        </section>

        <section className="content-section matches-section" id="matches">
          <h2>Match Schedule</h2>

          <div className="match-controls">
            <label htmlFor="team-filter">
              Filter by Team:
              <select
                className="team-filter"
                id="team-filter"
                value={selectedTeam}
                onChange={handleTeamFilter}
              >
                <option value="all">All Teams</option>
                {teams.map(function (team) {
                  return (
                    <option key={team.code} value={team.code}>
                      {team.name}
                    </option>
                  )
                })}
              </select>
            </label>

            <div className="view-buttons" aria-label="Match display options">
              <button
                className={matchView === 'grid' ? 'view-button is-selected' : 'view-button'}
                type="button"
                aria-pressed={matchView === 'grid'}
                onClick={handleGridView}
              >
                Grid View
              </button>
              <button
                className={matchView === 'list' ? 'view-button is-selected' : 'view-button'}
                type="button"
                aria-pressed={matchView === 'list'}
                onClick={handleListView}
              >
                List View
              </button>
            </div>
          </div>

          {isLoadingMatches ? (
            <p className="match-empty">Loading live matches from Supabase...</p>
          ) : filteredMatches.length === 0 ? (
            <p className="match-empty">No matches found for this team.</p>
          ) : (
            <div className={matchView === 'list' ? 'match-list list-view' : 'match-list'}>
              {filteredMatches.map(function (match) {
                return (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    matchNumber={match.matchNumber}
                    team1={match.team1}
                    team1Code={match.team1Code}
                    team2={match.team2}
                    team2Code={match.team2Code}
                    venue={match.venue}
                    date={match.date}
                    price={match.prices.General}
                    prices={match.prices}
                    availableSeats={match.available_seats}
                    view={matchView}
                    onBook={handleSelectMatch}
                  />
                )
              })}
            </div>
          )}
        </section>

        <section className="content-section booking-section" id="booking">
          <h2>Ticket Booking</h2>

          <div className="booking-layout">
            <form className="booking-form" onSubmit={handleBookTicket}>
              <label htmlFor="match-select">Select Match:</label>
              <select
                id="match-select"
                value={selectedMatchId}
                onChange={handleBookingMatchChange}
                required
                disabled={matches.length === 0}
              >
                {matches.length === 0 ? (
                  <option value="">No matches available</option>
                ) : (
                  matches.map(function (match) {
                    return (
                      <option key={match.id} value={match.id}>
                        {match.matchNumber}: {match.team1} vs {match.team2} ({match.available_seats} seats left)
                      </option>
                    )
                  })
                )}
              </select>

              <label htmlFor="stand-select">Stand Category:</label>
              <select
                id="stand-select"
                value={selectedStand}
                onChange={handleStandChange}
                required
              >
                <option value="General">General</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>

              <label htmlFor="ticket-quantity">Number of Tickets:</label>
              <input
                id="ticket-quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={handleQuantityChange}
                required
              />

              <label htmlFor="customer-name">Name:</label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={handleNameChange}
                placeholder="Enter your name"
                minLength="2"
                maxLength="50"
                required
              />

              <label htmlFor="customer-email">Email:</label>
              <input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                maxLength="100"
                required
              />

              <label htmlFor="customer-phone">Phone Number:</label>
              <input
                id="customer-phone"
                type="tel"
                value={customerPhone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                minLength="10"
                maxLength="10"
                pattern="[0-9]{10}"
                title="Enter a 10-digit phone number without spaces or symbols."
                required
              />

              <fieldset>
                <legend>Seat Preference (optional):</legend>
                <label>
                  <input
                    type="radio"
                    name="seat-preference"
                    value="Near the entrance"
                    checked={seatPreference === 'Near the entrance'}
                    onChange={handleSeatPreferenceChange}
                  />
                  Near the entrance
                </label>
                <label>
                  <input
                    type="radio"
                    name="seat-preference"
                    value="Near the field"
                    checked={seatPreference === 'Near the field'}
                    onChange={handleSeatPreferenceChange}
                  />
                  Near the field
                </label>
                <label>
                  <input
                    type="radio"
                    name="seat-preference"
                    value="No preference"
                    checked={seatPreference === 'No preference'}
                    onChange={handleSeatPreferenceChange}
                  />
                  No preference
                </label>
              </fieldset>

              <button className="button" type="submit" disabled={!selectedMatch}>
                Book Now
              </button>
            </form>

            <aside className="summary-card" aria-live="polite">
              <h3>Booking Summary</h3>
              <p>Selected Match: <span>{selectedMatch ? selectedMatch.matchNumber : 'Not Selected'}</span></p>
              <p>Seats Available: <span>{selectedMatch ? selectedMatch.available_seats : 0}</span></p>
              <p>Stand Category: <span>{selectedStand || 'Not Selected'}</span></p>
              <p>Ticket Price: <span>{formatPrice(ticketPrice)}</span></p>
              <p>Quantity: <span>{quantity}</span></p>
              <p className="summary-total">Total Amount: <span>{formatPrice(totalPrice)}</span></p>
            </aside>
          </div>
        </section>

        <section className="content-section bookings-section" id="my-bookings">
          <h2>My Ticket Bookings</h2>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Match</th>
                  <th>Stand Category</th>
                  <th>Seat Preference</th>
                  <th>Number of Tickets</th>
                  <th>Total Amount</th>
                  <th>Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7">No bookings yet.</td>
                  </tr>
                ) : (
                  bookings.map(function (booking) {
                    return (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.matchNumber}: {booking.teams}</td>
                        <td>{booking.stand}</td>
                        <td>{booking.seatPreference}</td>
                        <td>{booking.quantity}</td>
                        <td>{formatPrice(booking.total)}</td>
                        <td>Confirmed</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="content-section guidelines-section" id="guidelines">
          <h2>Ticket Booking Guidelines</h2>
          <div className="guideline-list">
            <article className="guideline-card">
              <h3>Ticket Verification</h3>
              <p>Verify your ticket at the stadium entrance and carry your booking confirmation.</p>
            </article>
            <article className="guideline-card">
              <h3>ID Proof Requirement</h3>
              <p>Carry a valid government-issued ID proof for ticket verification.</p>
            </article>
            <article className="guideline-card">
              <h3>Prohibited Items</h3>
              <p>Outside food, beverages, sharp objects, and fireworks are not allowed inside the stadium.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; 2026 IPL Ticket Booking. All Rights Reserved.</p>
      </footer>

      {toastMessage !== '' && (
        <div className="toast" role="status" aria-live="polite">
          <span>{toastMessage}</span>
          <button className="toast-close" type="button" onClick={handleToastClose} aria-label="Close message">
            ×
          </button>
        </div>
      )}
    </>
  )
}

export default App