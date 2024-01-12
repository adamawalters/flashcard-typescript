import {useState, useEffect} from 'react'
import { Card, Deck } from '../Types/types'
import {useNavigate} from 'react-router-dom'


export default function Layout() {


  const [decks, setDecks] = useState<Array<Deck>>([])
  const navigate = useNavigate(); 

  useEffect(()=> {
    setDecks([])
    const abortController = new AbortController()


  })

  return (
    <div>Layout</div>
  )
}
