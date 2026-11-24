function formatPrice(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

function MatchCard({
  id = 'match-unavailable',
  matchNumber = 'Match',
  team1 = 'Team to be announced',
  team1Code = '',
  team2 = 'Team to be announced',
  team2Code = '',
  venue = 'Venue to be announced',
  date = 'Date to be announced',
  price = 0,
  prices = {},
  view = 'grid',
  onBook = function () {},
}) {
  // Match details and the click handler are received from the parent as props.
  function handleBookClick() {
    console.log('Selected match:', id, team1, team2)
    onBook(id)
  }

  const cardClassName = view === 'list' ? 'match-card match-card-list' : 'match-card'

  return (
    <article className={cardClassName}>
      <p className="match-number">{matchNumber}</p>
      <h3>{team1} ({team1Code}) vs {team2} ({team2Code})</h3>
      <p><strong>Date and Time:</strong> {date}</p>
      <p><strong>Venue:</strong> {venue}</p>
      <div className="ticket-prices">
        <p>General: {formatPrice(price)}</p>
        <p>Premium: {formatPrice(prices.Premium)}</p>
        <p>VIP: {formatPrice(prices.VIP)}</p>
      </div>
      <a className="book-link" href="#booking" onClick={handleBookClick}>
        Book
      </a>
    </article>
  )
}

export default MatchCard
