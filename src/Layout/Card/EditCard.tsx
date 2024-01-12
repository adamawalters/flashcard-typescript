import React from 'react'
import Deck from '../Deck/Deck'

type EditCardProps = {
  deck: Deck, 
  toggleDeckUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditCard({deck, toggleDeckUpdate}: EditCardProps) {
  return (
    <div>EditCard</div>
  )
}
