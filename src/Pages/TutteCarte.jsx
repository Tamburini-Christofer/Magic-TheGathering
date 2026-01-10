//! Importazioni necessarie
import { useEffect, useState } from "react";
import Filter from "../Components/FIlter";
import Card from "../Components/Card";

//! Definizione del componente Carte per visualizzare tutte le carte con filtro
const Carte = () => {
  const [cards, setCards] = useState([]);
  const [sfondoClasse, setSfondoClasse] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3001/cards");
        const json = await res.json();
        setCards(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error("Errore caricamento cards:", e);
        setCards([]);
      }
    };
    load();
  }, []);
//!

//! Render del componente con filtro e lista di carte

  return (
    <>
      <div className="contenitoreCard">
        <div className="contenitoreCardSx">
          <Filter onSfondoChange={setSfondoClasse} />
        </div>
        <div className={`contenitoreCardDx ${sfondoClasse}`.trim()}>
          <div className="cardsContainer">
            {cards.length === 0 && <p>Caricamento...</p>}
            {cards.map((c) => (
              <Card key={c.id} id={c.id} 
              className="cards"/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carte;