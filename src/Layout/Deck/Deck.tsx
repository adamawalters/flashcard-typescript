import React from 'react'
import { useParams } from 'react-router-dom'

export default function Deck({deleteDeckHandler, loadDecks}) {
  const {deckId} = useParams();
  return (
    <div>Deck id: {deckId}</div>
  )
}
