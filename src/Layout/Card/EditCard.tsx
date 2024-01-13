import { useState, useEffect } from "react";
import Deck from "../Deck/Deck";
import { useParams, Link, useNavigate } from "react-router-dom";
import { readCard, updateCard } from "../../utils";
import { Card } from "../../Types/types";
import CardForm from "./CardForm";

type EditCardProps = {
  deck: Deck;
  toggleDeckUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditCard({ deck, toggleDeckUpdate }: EditCardProps) {
  /*This path: /decks/:deckId/cards/:cardId/edit */
  /*This is a form that lets you edit a card within a deck */

  /*Gets deckID, cardID from URL */
  const parameters = useParams() as { deckId: string; cardId: string };
  const deckId = Number(parameters.deckId);
  const cardId = Number(parameters.cardId);

  const initialCardState: Card = {
    front: "",
    back: "",
    deckId: 0,
    id: 0,
  };

  /*Set up card state*/
  const [card, setCard] = useState<Card>(initialCardState);
  const navigate = useNavigate();

  /*Read Card from API and overwrite blank card when cardId updates*/
  useEffect(() => {
    setCard(initialCardState);
    const abortController = new AbortController();
    async function loadCard() {
      try {
        const cardFromApi = await readCard(cardId, abortController.signal);
        setCard(cardFromApi);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          throw error;
        }
      }
    }
    loadCard();
    return () => abortController.abort();
  }, [cardId]);

  /*Event handler when form is submitted. Post the card to the API (either update or create)  */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateCard(card);
      navigate(`/decks/${deckId}`);
      /*Call for re-render in parent*/
      toggleDeckUpdate((currentValue) => !currentValue);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        throw error;
      }
    }
  };

  /*Keep card form data up to date with state */
  const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    setCard({ ...card, [event.target.name]: event.target.value });
  };

  /* Create markup - uses reusable "CardForm" component */

  if (card.id) {
    const title = <h1>Edit Card</h1>;

    const breadcrumb = (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" aria-current="page">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {`Edit Card ${cardId}`}
          </li>
        </ol>
      </nav>
    );

    return (
      <main>
        {breadcrumb}
        {title}
        <CardForm
          changeHandler={handleChange}
          submitHandler={handleSubmit}
          card={card}
          edit={true}
        />
      </main>
    );
  }

  return "Loading";
}
