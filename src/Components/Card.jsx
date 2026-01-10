import { useState, useEffect, useCallback, useRef } from "react";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import Calck from "chalk";

function Card({ id, title, manaCost, category, description, powerToughness, author, copyright, imageUrl, className, forceFavActive }) {

  const [isFavorited, setIsFavorited] = useState(false);
  const [card, setCard] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  const loadCard = useCallback(async (cardId) => {
    if (!cardId) {
      setCard(null);
      return;
    }

    try {
      setCard(true); // loading state
      const base = "http://localhost:3001";
      const res = await fetch(`${base}/cards/${cardId}`);
      const json = await res.json();
      setCard(json.card);
      console.log(`Le carte sono state caricate ${Calck.green("correttamente")}`);
    } catch (error) {
      console.error(`${Calck.red("Errore nel caricamento della carta:")}`, error);
      setCard(null);
    }
  }, []);

  const toggleFav = () => {
    const cardObj = { id: card?.id ?? id, title: card?.title ?? title };
    const nowFav = toggleFavorite(cardObj);
    setIsFavorited(nowFav);
    if (nowFav) {
      console.log(`${Calck.green("Aggiunta ai preferiti:")} ${cardObj.title}`);
    } else {
      console.log(`${Calck.red("Rimossa dai preferiti:")} ${cardObj.title}`);
    }
    window.dispatchEvent(new CustomEvent("favoritesChanged"));
  };

  const handleContainerClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    setExpanded(v => !v);
  };

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

  // display prende i dati dal fetch se disponibili, altrimenti usa le prop ricevute
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

  // determina automaticamente la classe 'terra' da applicare basata sulla categoria
  const _cat = (display?.category ?? category ?? '').toString().toLowerCase();
  const landTypes = ['forest', 'island', 'mountain', 'plains', 'swamp'];
  let landClass = landTypes.find(t => _cat.includes(t)) || '';

  // sinronizza stato preferito quando cambia la carta mostrata
  useEffect(() => {
    setIsFavorited(isFavorite(display.id));
  }, [display.id]);

  // determina automaticamente la classe 'terra' da applicare basata sulla categoria, titolo o descrizione
  const textToScan = `${display?.category ?? category ?? ''} ${display?.title ?? ''} ${display?.description ?? ''}`.toString().toLowerCase();
  const landVariants = {
    forest: ['forest', 'foresta', 'foreste', 'bosco', 'boschi'],
    island: ['island', 'isola', 'isole'],
    mountain: ['mountain', 'montagna', 'montagne'],
    plains: ['plains', 'piana', 'pianura', 'piani'],
    swamp: ['swamp', 'palude', 'paludi']
  };

  landClass = '';
  for (const [key, variants] of Object.entries(landVariants)) {
    if (variants.some(v => textToScan.includes(v))) { landClass = key; break; }
  }

  // rileva carte 'mana' (hanno manaCost ma non sono terre)
  const hasManaCost = !!(display?.manaCost || manaCost);
  const manaClass = (hasManaCost && !landClass) ? 'mana' : '';

  // rileva colore principale delle carte (quando non è una land)
  const colorVariants = {
    red: ['red', 'rosso'],
    blue: ['blue', 'blu'],
    green: ['green', 'verde'],
    white: ['white', 'bianco'],
    black: ['black', 'nero']
  };
  let colorClass = '';
  if (!landClass) {
    const apiColors = display?.colors || display?.color || display?.colours || display?.colour;

    if (!colorClass && typeof apiColors === 'string') {
      for (const [key, variants] of Object.entries(colorVariants)) {
        if (variants.some(v => apiColors.toString().toLowerCase().includes(v))) { colorClass = key; break; }
      }
    }

    if (!colorClass) {
      for (const [key, variants] of Object.entries(colorVariants)) {
        if (variants.some(v => textToScan.includes(v))) { colorClass = key; break; }
      }
    }
  }

  const favActive = typeof forceFavActive === 'boolean' ? forceFavActive : isFavorited;

  return (
    <>
      <div ref={containerRef} className={`cards ${className ?? ''} ${landClass} ${manaClass} ${colorClass} ${expanded ? 'expanded' : ''}`.trim()} onClick={handleContainerClick}>
        <div className="sopraSfondo">
          <div className="titleCard">
            <h4>{display.title}</h4>
            <div className="costMana">{display.manaCost}</div>
          </div>
          <div className="imgCard">
            <img src={display.imageUrl} alt={display.title} />
          </div>
          <div className="categoryCard">
            <h5>{display.category}</h5>
          </div>
          {/* rarità nascosta, usata per il filtro tramite i simboli di rarità */}
          {display.rarity && (
            <span className="rarityHidden" style={{ display: "none" }}>
              {display.rarity}
            </span>
          )}
          {/* colore nascosto, usato per il filtro tramite i simboli di mana */}
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
              // calcola power/toughness: preferisci i valori dal display, altrimenti prova la prop `powerToughness`
              (() => {
                const dp = (typeof display?.power !== 'undefined' && display?.power !== null) ? Number(display.power) : null;
                const dt = (typeof display?.toughness !== 'undefined' && display?.toughness !== null) ? Number(display.toughness) : null;
                let parsedPower = dp;
                let parsedToughness = dt;
                if ((parsedPower === null || Number.isNaN(parsedPower)) && powerToughness) {
                  const parts = String(powerToughness).split('/');
                  parsedPower = parts[0] ? Number(parts[0]) : NaN;
                }
                if ((parsedToughness === null || Number.isNaN(parsedToughness)) && powerToughness) {
                  const parts = String(powerToughness).split('/');
                  parsedToughness = parts[1] ? Number(parts[1]) : NaN;
                }

                const showPower = typeof parsedPower === 'number' && !Number.isNaN(parsedPower) && parsedPower !== 0;
                const showToughness = typeof parsedToughness === 'number' && !Number.isNaN(parsedToughness) && parsedToughness !== 0;

                if (!showPower && !showToughness) return null;

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
