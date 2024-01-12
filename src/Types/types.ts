

 export type Deck = {
    id: number, 
    name: string,
    description: string,
    cards: Array<Card>
}

 export type Card = {
    id: number,
    front: string,
    back: string,
    deckId: number,
}

export type CreateDeckType = {
    name: string,
    description: string
}

