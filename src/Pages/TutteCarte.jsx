//! Importazione necessarie
import { useEffect, useState } from "react";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import chalk from "chalk";
//!

//! Importazione dei componenti Filter e Card
import Filter from "../Components/FIlter";
import Card from "../Components/Card";
//!

//! Definizione del componente Carte per visualizzare tutte le carte con filtro
const Carte = () => {
  const [cards, setCards] = useState([]);                                                     //* Array di tutte le carte caricate dal server
  const [visibleCount, setVisibleCount] = useState(0);                                        //* Numero di carte attualmente visibili dopo i filtri
  const [isLoading, setIsLoading] = useState(true);                                           //* Stato di caricamento iniziale delle carte
  const [sfondoClasse, setSfondoClasse] = useState("");                                       //* Classe CSS per lo sfondo dinamico
  const [selectedCard, setSelectedCard] = useState(null);                                     //* Carta selezionata per il dettaglio nell'overlay
  const [selectedIsFav, setSelectedIsFav] = useState(false);                                  //* Stato se la carta selezionata è nei preferiti
  const [initialCardsAnimDone, setInitialCardsAnimDone] = useState(false);                    //* Animazione di ingresso carte eseguita
//!

//! Effetto per caricare le carte dal server al montaggio del componente
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3001/cards");
        const json = await res.json();
        const list = Array.isArray(json) ? json : [];
        console.log(list)
        setCards(list);
        setVisibleCount(list.length);                                                          //* inizialmente sono tutte visibili
        setIsLoading(false);
        console.log(`Le carte sono state caricate ${chalk.green("correttamente")}`); 
      } 
      catch (e) {
        console.error("Errore caricamento cards:", e);
        setCards([]);
        setVisibleCount(0);
        setIsLoading(false);
      }
    };
    load();
  }, []);
//!
  
  //! Segna come conclusa l'animazione iniziale delle carte dopo il primo caricamento
  useEffect(() => {
    if (!isLoading && !initialCardsAnimDone) {                                                  //* Se non sta caricando e l'animazione non è ancora stata eseguita
      const timer = setTimeout(() => {
        setInitialCardsAnimDone(true);
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, initialCardsAnimDone]);
//!

//! Funzioni per gestire l'apertura del dettaglio carta e il toggle dei preferiti
  const handleCardClick = (cardData) => {
    if (!cardData || !cardData.id) return;                                                      //* Verifica che i dati della carta siano validi
    setSelectedCard(cardData);
    setSelectedIsFav(isFavorite(cardData.id));
  };
//!

//! Funzione per aggiungere/rimuovere la carta selezionata dai preferiti
  const handleToggleFavoriteOverlay = () => {
    if (!selectedCard || !selectedCard.id) return;
    const nowFav = toggleFavorite({ id: selectedCard.id, title: selectedCard.title });
    setSelectedIsFav(nowFav);
    window.dispatchEvent(new CustomEvent("favoritesChanged"));
  };
//!

//! Funzione per chiudere l'overlay del dettaglio carta
  const handleCloseOverlay = () => {
    setSelectedCard(null);
  };

//! Render del componente con filtro e lista di carte
  return (
    <>
      <div className="contenitoreCard">
        <div className="contenitoreCardSx">
          <Filter onSfondoChange={setSfondoClasse} onResultsChange={setVisibleCount} />
        </div>
        <div className={`contenitoreCardDx ${sfondoClasse}`.trim()}>
          <div className="cardsContainer">
            {isLoading && <p>Caricamento...</p>}
            {!isLoading && visibleCount === 0 && (
              <div className="noResultsWrapper">
                <div className="noResultsCard">
                  <h3 className="noResultsTitle">Nessuna carta trovata</h3>
                </div>
              </div>
            )}
            {cards.map((c) => (
              <Card
                key={c.id}
                id={c.id}
                className={`cards ${initialCardsAnimDone ? "" : "cards--all-initial"}`.trim()}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dettaglio carta overlay */}

      {selectedCard && (
        <div className="card-detail-overlay" onClick={handleCloseOverlay}>
          <div className="card-detail-overlay-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="card-detail-overlay-close"
              onClick={handleCloseOverlay}>✕</button>

            <div className="card-detail-left">
              <h2 className="card-detail-title">{selectedCard.title}</h2>
              <div className="card-detail-info">

              {/* Descrizione mana nell'overlay */}

                <div className="dettMana">
                    <p>
                  <strong style={{ color: "var(--Gold)" }}>Costo in mana:</strong>
                  {selectedCard.manaCost != null && selectedCard.manaCost !== "-" ? (
                    <span className="costMana">{selectedCard.manaCost}</span>
                  ) : (
                    " -"
                  )}
                </p>
                <p>
                  Identifica il costo necessario di mana per giocare la carta. I principali tipi di mana sono:
                  <br />
                  <span className="mana-inline-item">
                    <img className="mana-icon-inline" src="/mana/sun.png" alt="Mana bianco" />
                    Bianco (ordine, difesa, cura)
                  </span>
                  <br />
                  <span className="mana-inline-item">
                    <img className="mana-icon-inline" src="/mana/water.png" alt="Mana blu" />
                    Blu (controllo, pescare carte)
                  </span>
                  <br />
                  <span className="mana-inline-item">
                    <img className="mana-icon-inline" src="/mana/swamp.png" alt="Mana nero" />
                    Nero (sacrificio, morte)
                  </span>
                  <br />
                  <span className="mana-inline-item">
                    <img className="mana-icon-inline" src="/mana/mountains.png" alt="Mana rosso" />
                    Rosso (danni, velocità)
                  </span>
                  <br />
                  <span className="mana-inline-item">
                    <img className="mana-icon-inline" src="/mana/three.png" alt="Mana verde" />
                    Verde (creature grandi, natura)
                  </span>
                  <br />
                  <span className="mana-inline-item">
                    <img className="mana-icon-inline" src="/mana/nocolor.webp" alt="Mana incolore" />
                    Incolore (mana senza colore specifico)
                  </span>
                </p>
                </div>

                {/* Descrizione tipologia nell'overlay */}

                <div className="dettTipologia">
                <p>
                  <strong style={{ color: "var(--Gold)" }}>Tipologia:</strong> {selectedCard.category ?? "-"}
                </p>
                <p>
                  Indica il tipo di carta giocata. <br />
                  Le tipologie più comuni sono: 
                  <br />terra (produce mana), creatura (combatte), stregoneria (effetto nel tuo turno), <br />
                  istantaneo (effetto in qualsiasi momento), incantesimo (effetto continuo), <br />
                  artefatto (oggetto magico), planeswalker (personaggio con abilità)
                  e <br />battaglia (va attaccata per ottenere l’effetto).
                </p>
                </div>

                {/* Descrizione rarità nell'overlay */}

                  <div className="dettRarita">
                        <p>
                  <strong style={{ color: "var(--Gold)" }}>Rarità:</strong>{" "}
                  {selectedCard.rarity && (
                    <span className="rarity-inline-item">
                      {(() => {
                        const rarity = selectedCard.rarity.toString().toLowerCase();
                        let src = "";
                        if (rarity.includes("comune")) src = "/rarity/comuns.png";
                        else if (rarity.includes("non comune")) src = "/rarity/silver.png";
                        else if (rarity.includes("rara")) src = "/rarity/rare.png";
                        else if (rarity.includes("mitica")) src = "/rarity/mitic.png";
                        if (!src) return null;
                        return <img className="rarity-icon-inline" src={src} alt={selectedCard.rarity} />;
                      })()}
                    </span>
                  )}
                </p>
                <p>
                  Rappresenta la probabilità di trovare la carta. Le rarità principali sono:
                  <br />
                  <span className="rarity-inline-item">
                    <img className="rarity-icon-inline" src="/rarity/comuns.png" alt="Comune" />
                    (facile da trovare, base dei mazzi)
                  </span>
                  <br />
                  <span className="rarity-inline-item">
                    <img className="rarity-icon-inline" src="/rarity/silver.png" alt="Non comune" />
                    (più potente o tecnica, meno frequente)
                  </span>
                  <br />
                  <span className="rarity-inline-item">
                    <img className="rarity-icon-inline" src="/rarity/rare.png" alt="Rara" />
                    (forte o unica, difficile da trovare)
                  </span>
                  <br />
                  <span className="rarity-inline-item">
                    <img className="rarity-icon-inline" src="/rarity/mitic.png" alt="Mitica rara" />
                    (molto potente o iconica, rarissima)
                  </span>
                </p>
                </div>

                {/* Descrizione generale nell'overlay */}
               
                  <div className="dettDescrizione"> 
                       <p>
                  <strong style={{ color: "var(--Gold)" }}>Descrizione:</strong> {selectedCard.description ?? "-"}
                </p>
                <p>
                  Qui trovi il testo della carta e le sue abilità. Alcune parole chiave frequenti sono: volare, raggiungere, travolgere, doppio attacco,
                  attacco improvviso, vigilanza, tocco letale, legame vitale, indistruttibile, anti-malocchio, protezione, minacciare, rapidità, difensore,
                  flash e volontà (Ward).
                </p>

                  </div>

                  {/* Descrizione forza/difesa nell'overlay */}
             
                  <div  className="dettForzaDifesa">
                <p>
                  <strong style={{color: "var(--Gold)"}}>Forza / Difesa:</strong>{" "}
                  {(() => {
                    const p = selectedCard.power ?? selectedCard.forza ?? null;
                    const t = selectedCard.toughness ?? selectedCard.difesa ?? null;
                    if (p == null && t == null) return "-";
                    return `${p ?? "-"} / ${t ?? "-"}`;
                  })()}
                </p>

                {/* Descrizione autore nell'overlay */}

                <div className="dettAutore">
                    <p >
                      <strong style={{ color: "var(--Gold)" }}>Autore:</strong> {selectedCard.artist ?? selectedCard.author ?? "-"}
                    </p>
                    <p>
                      Indica l’illustratore o l’artista che ha realizzato l’immagine della carta.
                    </p>
                </div>

                <div className="dettCopyright">
                 <p >
                  <strong style={{ color: "var(--Gold)" }}>Copyright:</strong> {selectedCard.copyright ?? "-"}
                </p>
              </div>
                </div>
              </div>
              <button
                type="button"
                className={`card-detail-fav-btn ${selectedIsFav ? "active" : ""}`}
                onClick={handleToggleFavoriteOverlay}
              >
                {selectedIsFav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              </button>
            </div>

            <div className="card-detail-right">
              <Card
                id={selectedCard.id}
                className="cards card-overlay-card"
                forceFavActive={selectedIsFav}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Carte;