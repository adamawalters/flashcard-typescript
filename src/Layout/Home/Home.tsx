import {Link} from "react-router-dom";
import HomeDeckCard from "./HomeDeckCard"
import type { Deck } from "../../Types/types";

type HomeProps = {
  decks: Array<Deck>,
  deleteDeckHandler: (deckIdToDelete: number) => Promise<void>
}

function Home({decks, deleteDeckHandler} : HomeProps){
    /*Home path: "/" */
    /*Home accepts decks as a prop from Layout */
    /*Objective: For each deck, Home renders it below the Create Deck Button with "View, Study, Delete"*/

    /*Create deck button links to create deck screen */
    const createDeckBtn = <button className="btn btn-secondary"><Link className="text-reset" to={`/decks/new`}>+ Create Deck</Link></button>;

    /* Creates card views for each deck in the decks state*/
    const deckList = decks.map((deck, index) => {
        return <HomeDeckCard key={index} deck={deck} deleteDeckHandler={()=>deleteDeckHandler(deck.id)}/>
    })

    return (
        <main>
            {createDeckBtn}
            {deckList}
        </main>
    )
}

export default Home;