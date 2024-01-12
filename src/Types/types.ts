

export type Deck = {
    id: number, 
    name: string,
    description: string,
    cards: Array<Card>
}

export type Card = {
    id: string,
    front: string,
    back: string,
    deckId: number,
}
