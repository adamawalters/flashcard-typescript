import { Deck } from '../../Types/types'
import { Link } from 'react-router-dom';

type HomeDeckCardProps = {
  deck: Deck,
  deleteDeckHandler: () => Promise<void>
}

export default function HomeDeckCard({deck, deleteDeckHandler}: HomeDeckCardProps) {

  const card = (
    <div className="card">
      <div className="card-body">
        <div className="card-header-wrapper">
          <h5 className="card-title">{deck.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{deck.cards.length} cards</h6>
        </div>
        <p className="card-text">
          {deck.description}
        </p>
        <div className="card-wrapper">
          <button className="btn btn-secondary card-btn">
              <Link className="text-reset" to={`$/decks/${deck.id}`}>View</Link>
          </button>
          <button className="btn btn-primary card-btn">
              <Link className="text-reset" to={`/decks/${deck.id}/study`}>Study</Link>
          </button>
          <button className="btn btn-danger card-btn" onClick={deleteDeckHandler}>
              Delete
          </button>
        </div>
       
      </div>
    </div>
  );

  return card;
}
