import { useState } from "react";
import { Deck } from "../../Types/types";
import { useParams, Link } from "react-router-dom";
import CardForm from "./CardForm";
import { createCard } from "../../utils";

type AddCardProps = {
  deck: Deck;
  loadDeck: (signal?: AbortSignal) => Promise<void>;
};

export default function AddCard({ deck, loadDeck }: AddCardProps) {
  /*Path: /decks/:deckId/cards/new */
  /*Objective: lets users add cards to a deck one card at a time with a form for the front & back of the card. */

  /*Need deck ID from the parameter to know where to post the card */
  const deckId = Number(useParams().deckId as string);

  /*State to keep form data & form values in sync */
  const initialFormData = {
    front: "",
    back: "",
  };
  
  const [formData, setFormData] = useState({ ...initialFormData });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  /* When form is submitted, create the card via API call and reset form data */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createCard(deckId, formData);
      setFormData({ ...initialFormData });
      /*Update "Deck" state*/
      loadDeck();
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.log(error);
      }
    }
  };

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
          Add Card
        </li>
      </ol>
    </nav>
  );

  const title = <h1>{deck.name}: Add Card</h1>;

  return (
    <main>
      {breadcrumb}
      {title}
      <CardForm
        changeHandler={handleChange}
        submitHandler={handleSubmit}
        card={formData}
        edit={false}
      />
    </main>
  );
}
