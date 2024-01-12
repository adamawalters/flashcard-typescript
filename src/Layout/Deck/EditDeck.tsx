import React, { ChangeEvent, FormEvent, useState } from 'react'
import type { Deck } from '../../Types/types'

type EditDeckProps = {
  deck: Deck,
  toggleDeckUpdate: React.Dispatch<React.SetStateAction<boolean>>,
  setDeck: React.Dispatch<React.SetStateAction<Deck>>,
}

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { updateDeck } from '../../utils';

function EditDeck({deck, setDeck, toggleDeckUpdate} : EditDeckProps) {
  /*Path: /decks/:deckId/edit */

  /*Prefill form state to existing deck */
  const [formData, setFormData] = useState({...deck});
  const { deckId } = useParams();
  const navigate = useNavigate();

  /*Keep form state and input updated*/
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  
  /*Event handler runs when updated deck data is submitted. Posts to server and goes to deck page. Deck state updated to form.  */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
        try{
            const response = await updateDeck(formData);
            setDeck({...formData});
            const id = response.id;
             /*Call for re-render of deck in parent*/
            toggleDeckUpdate((currentValue) => !currentValue)
            navigate(`/decks/${id}`)
        } catch(error) {
            if(error instanceof Error && error.name !== "AbortError") {
                throw Error;
            }
        }
  }
  

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
          Edit Deck
        </li>
      </ol>
    </nav>
  );

  const title = <h1>Edit Deck</h1>;

  const form = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Deck Name"
        value={formData.name}
        onChange={handleChange}
        required
      ></input>
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Brief description of deck"
        value={formData.description}
        onChange={handleChange}
        required
      ></textarea>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => {
          navigate(`/decks/${deckId}`)}
        }
      >
        Cancel
      </button>
      <button className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );

  return (
    <main>
      {breadcrumb}
      {title}
      {form}
    </main>
  );
}

export default EditDeck;

