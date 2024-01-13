import { useState, useEffect, useCallback } from "react";
import type { Deck } from "../Types/types";
import { useNavigate, Routes, Route } from "react-router-dom";
import { listDecks, deleteDeck } from "../utils";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home/Home";
import CreateDeck from "./Home/CreateDeck";
import { default as DeckComponent } from "./Deck/Deck";

export default function Layout() {
  const [decks, setDecks] = useState<Array<Deck>>([]);
  const navigate = useNavigate();
  const loadDecks = useCallback(async (signal?: AbortSignal) => {
    try {
      const decks = await listDecks(signal);
      setDecks(decks);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        throw Error;
      }
    }
  }, []);

  useEffect(() => {
    setDecks([]);
    const abortController = new AbortController();
    loadDecks(abortController.signal);
    return () => abortController.abort();
  }, [loadDecks]);

  /*Deletes deck after user confirmation. Passed to Home and Deck components*/
  const deleteDeckHandler = async (deckIdToDelete: number) => {
    const canDelete =  window.confirm(`Delete this deck? You will not be able to recover it.`)
    if(canDelete) {
      const newDecksPostDeletion = decks.filter(
        (deck) => deck.id !== deckIdToDelete
      );
      setDecks(newDecksPostDeletion);
     console.log(`delete deck response: ${JSON.stringify(await deleteDeck(deckIdToDelete))}`);
      loadDecks();
      navigate(`/`);
    }  
  }
  
  /*Layout component returns the Home, CreateDeck, or Decks View after fetching deck data from the API */
  if (decks) {
    return (
      <>
        <Header />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <Home decks={decks} deleteDeckHandler={deleteDeckHandler} />
              }
            ></Route>
            <Route
              path="/decks/new"
              element={<CreateDeck loadDecks={loadDecks} />}
            ></Route>
            <Route
              path="/decks/:deckId/*"
              element={
                <DeckComponent
                  deleteDeckHandler={deleteDeckHandler}
                  loadDecks={loadDecks}
                />
              }
            ></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </>
    );
  }
  return "Loading";
}
