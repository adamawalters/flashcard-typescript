/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */

import type {
  Card,
  Deck,
  CreateDeckType,
  CreateCardType,
} from "../Types/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Removes the `cards` property from the deck so it is not accidentally saved with the deck.
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param deck
 *  the deck instance
 * @returns {*}
 *  a copy of the deck instance with the `cards` property removed.
 */
function stripCards(deck: Deck): Partial<Deck> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cards, ...deckWithoutCards } = deck;
  return deckWithoutCards;
}

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  default value returned if the fetch is cancelled.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */

async function fetchJson<T>(
  url: string,
  options: RequestInit,
  onCancel: Array<Deck> | Array<Card> | Deck | Card,
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (response.status < 200 || response.status > 399) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    /* if (response.status === 204) {
      return null;
    } */

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof Error && error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel) as Promise<T>;
  }
}

/**
 * Retrieves all existing decks.
 * @returns {Promise<[deck]>}
 *  a promise that resolves to a possibly empty array of decks saved in the database.
 */
export async function listDecks(signal?: AbortSignal) {
  const url = `${API_BASE_URL}/decks?_embed=cards`;
  return await fetchJson<Deck[]>(url, { signal }, []);
}

/**
 * Saves deck to the database (public/data/db.json).
 * There is no validation done on the deck object, any object will be saved.
 * @param deck
 *  the deck to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<deck>}
 *  a promise that resolves the saved deck, which will now have an `id` property.
 */
export async function createDeck(deck: CreateDeckType) {
  const url = `${API_BASE_URL}/decks`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(deck),
  };
  return await fetchJson<Deck>(url, options, <Deck>{});
}

/**
 * Retrieves the deck with the specified `deckId`
 * @param deckId
 *  the `id` property matching the desired deck.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<any>}
 *  a promise that resolves to the saved deck.
 */
export async function readDeck(deckId: number, signal?: AbortSignal) {
  const url = `${API_BASE_URL}/decks/${deckId}?_embed=cards`;
  return await fetchJson<Deck>(url, { signal }, <Deck>{});
}

/**
 * Updates an existing deck
 * @param updatedDeck
 *  the deck to save, which must have an `id` property.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated deck.
 */
export async function updateDeck(updatedDeck: Deck, signal?: AbortSignal) {
  const url = `${API_BASE_URL}/decks/${updatedDeck.id}?_embed=cards`;
  const options: RequestInit = {
    method: "PUT",
    headers,
    body: JSON.stringify(stripCards(updatedDeck)),
    signal,
  };

  return await fetchJson<Deck>(url, options, updatedDeck);
}

/**
 * Deletes the deck with the specified `deckId`.
 * @param deckId
 *  the id of the deck to delete
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to an empty object.
 */
export async function deleteDeck(deckId: number) {
  const url = `${API_BASE_URL}/decks/${deckId}`;
  const options = { method: "DELETE" };
  return await fetchJson<Deck>(url, options, <Deck>{});
}

/**
 * Creates a new card associated with the specified `deckId`.
 * There is no validation that there is an existing deck with the specified `deckId`.
 * @param deckId
 *  the id of the target deck
 * @param card
 *  the card to create, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the new card, which will have an `id` property.
 */
export async function createCard(
  deckId: number,
  card: CreateCardType,
  signal?: AbortSignal,
) {
  // There is a bug in json-server, if you post to /decks/:deckId/cards the associated deckId is a string
  // and the card is not related to the deck because the data types of the ID's are different.
  const url = `${API_BASE_URL}/cards`;
  card.deckId = deckId;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(card),
    signal,
  };
  return await fetchJson<Card>(url, options, <Card>{});
}

/**
 * Retrieves the card with the specified `cardId`
 * @param cardId
 *  the id of the target
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the saved card.
 */
export async function readCard(cardId: number, signal: AbortSignal) {
  const url = `${API_BASE_URL}/cards/${cardId}`;
  return await fetchJson<Card>(url, { signal }, <Card>{});
}

/**
 * Updates an existing deck
 * @param updatedCard
 *  the card to save, which must have an `id` property.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated card.
 */
export async function updateCard(updatedCard: Card) {
  const url = `${API_BASE_URL}/cards/${updatedCard.id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedCard),
  };
  return await fetchJson<Card>(url, options, <Card>{});
}

/**
 * Deletes the card with the specified `cardId`.
 * @param cardId
 *  the id of the card to delete
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to an empty object.
 */
export async function deleteCard(cardId: number) {
  const url = `${API_BASE_URL}/cards/${cardId}`;
  const options = { method: "DELETE" };
  return await fetchJson<Card>(url, options, <Card>{});
}
