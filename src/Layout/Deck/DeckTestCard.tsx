import { useLocation, Link } from 'react-router-dom';

type DeckTestCardProps = {
  cardId: number, 
  front: string,
  back: string,
  deleteCardHandler: (cardIdToDelete: number) => Promise<void>
}

export default function DeckTestCard({cardId, front, back, deleteCardHandler}: DeckTestCardProps) {
  /*Path: /decks/:deckId */
  /*This component is used by the <Deck /> component and generates a view for cards within the deck. Each card has a link to its edit page */
  
  const url = useLocation().pathname;

  const cardUI = (
    <div className="card">
      <div className="card-body">
        <div className="qtn-wrapper">
          <p className="card-text qtn-child">{front}</p>
          <p className="card-text qtn-child">{back}</p>
        </div>
        <div className="qtn-btn-wrapper">
          <button className="btn btn-secondary">
            {
              <Link className="text-reset" to={`${url}/cards/${cardId}/edit`}>
                Edit
              </Link>
            }
          </button>
          <button
            className="btn btn-danger"
            onClick={() => deleteCardHandler(cardId)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return cardUI;
}
