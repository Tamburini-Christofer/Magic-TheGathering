//! Importo dei moduli necessari
import { useState, useEffect, useCallback, useRef } from "react";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import Calck from "chalk";

//! Componente Card per visualizzare le informazioni di una carta
function Card({
  id,
  title,
  manaCost,
  category,
  description,
  powerToughness,
  author,
  copyright,
  imageUrl,
  className,
  forceFavActive,
  draggableProps,
  onCardClick,
  onDataLoaded,
  compareDiff,
}) {

  //! Definizione degli stati e dei riferimenti
  const [isFavorited, setIsFavorited] = useState(false);                                                        //* Stato per indicare se la carta è nei preferiti
  const [card, setCard] = useState(null);                                                                       //* Stato per memorizzare i dati della carta
  const [expanded, setExpanded] = useState(false);    
  //!                                                                                                           //* Stato per gestire l'espansione della carta

  //! Riferimenti
  const containerRef = useRef(null);    
  //!                                                                                                           //* Riferimento al contenitore della carta

  //! Funzioni di caricamento della carta e gestione preferiti
  const loadCard = useCallback(async (cardId) => {
    if (!cardId) {
      setCard(null);
      return;
    }
    try {
      setCard(true);                                                                                           //* Imposta lo stato della carta a true durante il caricamento 
      const base = "http://localhost:3001";                                                                    //? URL base dell'API
      const res = await fetch(`${base}/cards/${cardId}`);                                                      //* Effettua la richiesta per ottenere i dati della carta
      const json = await res.json();                                                                           //* Converte la risposta in formato JSON 
      setCard(json.card);                                                                                      //* Aggiorna lo stato della carta con i dati ricevuta                            //todo Log di successo
    } catch (error) {
      console.error(`${Calck.red("Errore nel caricamento della carta:")}`, error);                             //todo Log di errore
      setCard(null);
    }
  }, []);                                                                                                      //! una sola volta al montaggio del componente
  //!

  //! Funzione per gestire il toggle dei preferiti
  const toggleFav = () => {
    const cardObj = { id: card?.id ?? id, title: card?.title ?? title };                                       //* Crea un oggetto carta con id e titolo
    const nowFav = toggleFavorite(cardObj);                                                                    //? Esegue il toggle dello stato di preferito
    setIsFavorited(nowFav);
    if (nowFav) {
      console.log(`${Calck.green("Aggiunta ai preferiti:")} ${cardObj.title}`);                                //todo Log di aggiunta ai preferiti
    } else {
      console.log(`${Calck.red("Rimossa dai preferiti:")} ${cardObj.title}`);                                  //todo Log di rimozione dai preferiti
    }
    window.dispatchEvent(new CustomEvent("favoritesChanged"));                                                 //* Dispatch di un evento personalizzato per notificare il cambiamento dei preferiti
  };
  //!

  //! Gestione del click sulla carta (espansione o callback esterna)
  const handleContainerClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    if (typeof onCardClick === "function") {
      onCardClick(display);
      return;
    }
    setExpanded((v) => !v);
  };
  //!

  //! Gestione fine trascinamento (solo se abilitato)
  const handleDragEndInternal = (e) => {
    if (typeof draggableProps?.onDragEnd === 'function') {
      draggableProps.onDragEnd(e);
    }
    if (draggableProps?.expandOnDrop) {
      setExpanded(true);
    }
  };
  //!

  //! Effetto per gestire il click esterno e chiudere l'espansione
  useEffect(() => {
    const onDocClick = (e) => {
      if (!expanded) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [expanded]);
  useEffect(() => {
    if (!id) {
      setCard(null);
      return;
    }
    loadCard(id);
  }, [id, loadCard]);
  //!

  //! Preparazione dei dati da visualizzare
  //? display prende i dati dal fetch se disponibili, altrimenti usa le prop ricevute
  const display = (card && typeof card === 'object') ? card : {
    id,
    title,
    manaCost,
    category,
    description,
    imageUrl,
    power: 0,
    toughness: 0,
    artist: author,
    set: copyright
  };
  //?

  //! Espone i dati della carta al parent (se richiesto)
  useEffect(() => {
    if (typeof onDataLoaded === 'function' && display && typeof display === 'object') {
      const safeNumber = (val) => {
        if (val === null || typeof val === 'undefined') return null;
        const n = Number(val);
        return Number.isNaN(n) ? null : n;
      };
      onDataLoaded({
        id: display.id,
        title: display.title,
        manaCost: display.manaCost,
        power: safeNumber(display.power),
        toughness: safeNumber(display.toughness),
        rarity: display.rarity || null,
        category: display.category || null,
        colors: display.colors || display.color || null,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display?.id, display?.title, display?.manaCost, display?.power, display?.toughness, display?.rarity, display?.category, display?.colors, display?.color]);

  //? determina automaticamente la classe 'terra' da applicare basata sulla categoria

  const _cat = (display?.category ?? category ?? '').toString().toLowerCase();
  const landTypes = ['forest', 'island', 'mountain', 'plains', 'swamp'];
  let landClass = landTypes.find(t => _cat.includes(t)) || '';
  //?


  //? sinronizza stato preferito quando cambia la carta mostrata

  useEffect(() => {
    setIsFavorited(isFavorite(display.id));
  }, [display.id]);
  //?

  //? rileva automaticamente la classe 'terra', 'mana' o colore principale da applicare
  const textToScan = `${display?.category ?? category ?? ''} ${display?.title ?? ''} ${display?.description ?? ''}`.toString().toLowerCase();
  const landVariants = {
    forest: ['forest', 'foresta', 'foreste', 'bosco', 'boschi'],
    island: ['island', 'isola', 'isole'],
    mountain: ['mountain', 'montagna', 'montagne'],
    plains: ['plains', 'piana', 'pianura', 'piani'],
    swamp: ['swamp', 'palude', 'paludi']
  };
  //?

  //? icone per la rarità
   const rarityIcons = {
    "comune": "/rarity/comuns.png",
    "non comune": "/rarity/silver.png",
    "rara": "/rarity/rare.png",
    "mitica": "/rarity/mitic.png",
  };
  //?

  //? rileva carte 'land' (terre)
  landClass = '';
  for (const [key, variants] of Object.entries(landVariants)) {
    if (variants.some(v => textToScan.includes(v))) { landClass = key; break; }
  }
  //?

  //? rileva carte 'mana' (hanno manaCost ma non sono terre)
  const hasManaCost = !!(display?.manaCost || manaCost);
  const manaClass = (hasManaCost && !landClass) ? 'mana' : '';
  //?

  //?rileva colore principale delle carte (quando non è una land)
  const colorVariants = {
    red: ['red', 'rosso'],
    blue: ['blue', 'blu'],
    green: ['green', 'verde'],
    white: ['white', 'bianco'],
    black: ['black', 'nero']
  };
  //?
  //!

  //! determina la classe colore

  let colorClass = '';
  if (!landClass) {
    const apiColors = display?.colors || display?.color || display?.colours || display?.colour;                   //? prova a leggere i colori da varie possibili proprietà   
    if (!colorClass && typeof apiColors === 'string') {                                                           //todo se è una stringa, prova a rilevare il colore da essa
      for (const [key, variants] of Object.entries(colorVariants)) {
        if (variants.some(v => apiColors.toString().toLowerCase().includes(v))) { colorClass = key; break; }           
      }
    }
    if (!colorClass) {                                                                                           //todo altrimenti prova a rilevare il colore dal testo 
      for (const [key, variants] of Object.entries(colorVariants)) {
        if (variants.some(v => textToScan.includes(v))) { colorClass = key; break; }
      }
    }
  }
  const favActive = typeof forceFavActive === 'boolean' ? forceFavActive : isFavorited;                           //* determina se il pulsante preferito deve essere attivo
  //!

  //! Render del componente Card

  return (
    <>
      <div
        ref={containerRef}
        className={`cards ${className ?? ''} ${landClass} ${manaClass} ${colorClass} ${expanded ? 'expanded' : ''}`.trim()}
        onClick={handleContainerClick}
        draggable={draggableProps?.draggable}
        onDragStart={draggableProps?.onDragStart}
        onDragOver={draggableProps?.onDragOver}
        onDrop={draggableProps?.onDrop}
        onDragEnd={handleDragEndInternal}
      >
        <div className="sopraSfondo">
          <div className="titleCard">
            <h4>{display.title}</h4>
            <div className="costMana">
              {display.manaCost}
            </div>
          </div>
          <div className="imgCard">
            <img src={display.imageUrl} alt={display.title} />
          </div>
          <div className="categoryCard">
            <h5>{display.category}</h5>
            
            {/* Icona e testo (nascosto) per la rarità, usata anche dal filtro */}

            {(() => {
              if (!display.rarity) return null;

              const rarity = display.rarity.toString().toLowerCase();

             
              const src = rarityIcons[rarity];
              if (!src) return null;
              return (
                <>
                  <img className="rarityIcon" src={src} alt={display.rarity} />
                  <span className="rarityHidden" style={{ display: "none" }}>
                    {display.rarity}
                  </span>
                </>
              );
            })()}
          </div>

          {/* Usato per il filtro tramite i simboli di mana */}

          {display.colors && (
            <span className="colorHidden" style={{ display: "none" }}>
              {display.colors}
            </span>
          )}
          <div className="descriptionCard">
            <p>
              {display.description}
            </p>
            {
              //todo calcola power/toughness: preferisci i valori dal display, altrimenti prova la prop `powerToughness`

              (() => {

                //? tenta di leggere power e toughness dai dati della carta

                const dp = (typeof display?.power !== 'undefined' && display?.power !== null) ? Number(display.power) : null;
                const dt = (typeof display?.toughness !== 'undefined' && display?.toughness !== null) ? Number(display.toughness) : null;
                let parsedPower = dp;
                let parsedToughness = dt;

                //todo se uno dei due non è valido, prova a leggerli dalla prop powerToughness

                if ((parsedPower === null || Number.isNaN(parsedPower)) && powerToughness) {
                  const parts = String(powerToughness).split('/');
                  parsedPower = parts[0] ? Number(parts[0]) : NaN;
                }

                //todo stessa cosa per toughness

                if ((parsedToughness === null || Number.isNaN(parsedToughness)) && powerToughness) {
                  const parts = String(powerToughness).split('/');
                  parsedToughness = parts[1] ? Number(parts[1]) : NaN;
                }

                //? determina se mostrare power e toughness (solo se sono numeri validi e diversi da zero)

                const showPower = typeof parsedPower === 'number' && !Number.isNaN(parsedPower) && parsedPower !== 0;
                const showToughness = typeof parsedToughness === 'number' && !Number.isNaN(parsedToughness) && parsedToughness !== 0;

                //todo se nessuno dei due va mostrato, ritorna null

                if (!showPower && !showToughness) return null;

                //todo altrimenti ritorna il JSX con i soli valori di forza/difesa

                return (
                  <div className="forzaCard">
                    {showPower && <span className="powerVal">{parsedPower}</span>}
                    {(showPower && showToughness) && <span className="sep">/</span>}
                    {showToughness && <span className="toughnessVal">{parsedToughness}</span>}
                  </div>
                );
              })()
            }
          </div>
        </div>
        <div className="authorCard">{display.artist ?? author}</div>
        <div className="authorCard authorCardC">{display.copyright ?? copyright}<br />
        <span>© The Gathering 2026</span></div>
        <button 
        className={`favBtn ${favActive ? "colorActive" : ""}`}
        onClick={(e) => { e.stopPropagation(); toggleFav(); }} 
        aria-label="Aggiungi ai preferiti" 
        tabIndex={-1}>

          <img src="/iconHeart.png" alt="Aggiungi ai preferiti" className="heartIcon"/>
        </button>
      </div>
    </>
  ); 
}

export default Card;
