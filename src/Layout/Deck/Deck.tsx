import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation, Link, Routes, Route } from "react-router-dom";
import { deleteCard, readDeck } from "../../utils";
import DeckTestCard from "./DeckTestCard";
import Study from "./Study";
import EditDeck from "./EditDeck";
import EditCard from "../Card/EditCard";
import AddCard from "../Card/AddCard";
import type { Deck } from "../../Types/types";

type DeckProps = {
  deleteDeckHandler: (deckIdToDelete: number) => Promise<void>;
  loadDecks: (signal?: AbortSignal) => Promise<void>;
};

function Deck({ deleteDeckHandler, loadDecks }: DeckProps) {
  /*This path: /decks/:deckId */
  /*Objective: displays details about the deck as well as each card in the deck,and lets users edit details about the deck, delete the deck, edit the cards, add cards, delete cards */
  /*Deck component has nested routes for: the study, edit, new card, or edit card view */

  const initialDeck: Deck = useMemo(() => {
    return {
      id: 0,
      name: "",
      description: "",
      cards: [],
    };
  }, []);

  const [deck, setDeck] = useState<Deck>(initialDeck);
  const deckId = Number(useParams().deckId as string);
  const url = useLocation().pathname;
  const [error, setError] = useState("");

  const loadDeck = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const deckFromApi = await readDeck(deckId, signal);
        setDeck(deckFromApi);
        loadDecks();
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          if (error.message.includes("404")) {
            setError(`Deck ID ${deckId} not found`);
          }
        } else {
          throw error;
        }
      }
    },
    [deckId, loadDecks]
  );

  /*Set the deck to the deck fetched from the API - runs when child edits deck, or when deckID parameter changes*/
  useEffect(() => {
    setDeck(initialDeck);
    const abortController = new AbortController();
    loadDeck(abortController.signal);
    return () => abortController.abort();
  }, [initialDeck, loadDeck]);

  /* After user confirmation, update state to new deck without card. Then, make API call to delete card from deck*/
  const deleteCardHandler = async (cardIdToDelete: number) => {
    const canDelete = window.confirm(
      "Delete this card? You will not be able to recover it."
    );
    if (canDelete) {
      try {
        await deleteCard(cardIdToDelete);
        loadDeck();
        loadDecks();
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
      }
    }
  };

  if (deck.id) {
    /*Create header for the deck view - shows details about the deck, edit, study, and add cards button */
    const deckHeader = (
      <div className="card border-0">
        <div className="card-body px-0">
          <h5 className="card-title">{deck.name}</h5>
          <p className="card-text">{deck.description}</p>
          <div className="card-wrapper">
            <button className="card-btn btn btn-secondary">
              {
                <Link className="text-reset" to={`${url}/edit`}>
                  Edit
                </Link>
              }
            </button>
            <button className="card-btn btn btn-primary">
              {
                <Link className="text-reset" to={`${url}/study`}>
                  Study
                </Link>
              }
            </button>
            <button className="card-btn btn btn-primary">
              {
                <Link className="text-reset" to={`${url}/cards/new`}>
                  +Add Cards
                </Link>
              }
            </button>
            <button
              className="card-btn btn btn-danger"
              onClick={() => deleteDeckHandler(deckId)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );

    const breadcrumb = (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" aria-current="page">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {deck.name}
          </li>
        </ol>
      </nav>
    );

    /*Create the view for each card (with both front & back to shown on the test view) */
    const deckTestCards = deck.cards.map((card) => {
      return (
        <DeckTestCard
          key={card.id}
          cardId={card.id}
          front={card.front}
          back={card.back}
          deleteCardHandler={deleteCardHandler}
        />
      );
    });

    /*Deck component displays the study, edit, new card, or edit card view */

    return (
      <Routes>
        <Route
          path={`/`}
          element={
            <main>
              {breadcrumb}
              {deckHeader}
              <h1>Cards</h1>
              {deckTestCards}
            </main>
          }
        ></Route>
        <Route path={`/study`} element={<Study deck={deck} />}></Route>
        <Route
          path={`/edit`}
          element={
            <EditDeck deck={deck} loadDeck={loadDeck} setDeck={setDeck} />
          }
        ></Route>
        <Route
          path={`/cards/new`}
          element={<AddCard deck={deck} loadDeck={loadDeck} />}
        ></Route>
        <Route
          path={`/cards/:cardId/edit`}
          element={<EditCard deck={deck} loadDeck={loadDeck} />}
        ></Route>
      </Routes>
    );
  }
  return error ? error : "Loading";
}

export default Deck;
