import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createDeck } from "../../utils";
import type { CreateDeckType } from "../../Types/types";

type CreateDeckProps = {
  loadDecks: (signal?: AbortSignal) => Promise<void>;
};

export default function CreateDeck({ loadDecks }: CreateDeckProps) {
  const initialFormData: CreateDeckType = {
    name: "",
    description: "",
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  /*Activated when form is submitted. Posts the new deck to the server, resets form data, and navigates to decks page */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await createDeck(formData);
      setFormData({ ...initialFormData });
      const id = response.id;
      loadDecks();
      navigate(`/decks/${id}`);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        throw Error;
      }
    }
  };

  /*Breadcrumb, title and markup created here */

  const breadcrumb = (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item" aria-current="page">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Create Deck
        </li>
      </ol>
    </nav>
  );

  const title = <h1>Create Deck</h1>;
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
        rows={5}
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
        onClick={() => navigate("/")}
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
