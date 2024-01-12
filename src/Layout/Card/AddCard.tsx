import React from 'react'
import { Deck } from '../../Types/types'

type AddCardProps = {
  deck: Deck, 
  toggleDeckUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddCard({deck, toggleDeckUpdate}: AddCardProps) {
  return (
    <div>AddCard</div>
  )
}
