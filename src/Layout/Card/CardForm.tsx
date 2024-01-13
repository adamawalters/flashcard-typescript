import React from 'react'
import type { CreateCardType } from '../../Types/types'
import { useNavigate, useParams } from 'react-router-dom';


type CardFormProps = {
  changeHandler: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  submitHandler: (event:  React.FormEvent<HTMLFormElement>) => Promise<void>,
  card: CreateCardType,
  edit: boolean
}

export default function CardForm({changeHandler, submitHandler, card, edit}: CardFormProps) {
  /* Edit prop is needed to determine what text on buttons to show for submit (differs between Edit & Add Card) */
  const {deckId} = useParams();

  /* Needed to navigate back home*/
  const navigate = useNavigate();

  const form = (
  <form onSubmit={submitHandler}>
    <label htmlFor="front">Front</label>
    <textarea
      name="front"
      id="front"
      placeholder="Front side of card"
      value={card.front}
      onChange={changeHandler}
      required
    ></textarea>
    <label htmlFor="back">Back</label>
    <textarea
      name="back"
      id="back"
      placeholder="Back side of card"
      value={card.back}
      onChange={changeHandler}
      required
    ></textarea>
    <button
      className="btn btn-secondary"
      onClick={() => navigate(`/decks/${deckId}`)}
      type="button"
    >
      {edit ? "Cancel" : "Done"}
    </button>
    <button className="btn btn-primary" type="submit">
      {edit ? "Submit" : "Save"}
    </button>
  </form>
);

  return form;
}
