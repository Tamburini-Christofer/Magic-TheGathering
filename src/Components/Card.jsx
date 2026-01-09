import { useState, useEffect, useRef } from "react";
import { toggleFavorite, isFavorite } from "../utils/favorites";


function Card({ id, title, manaCost, category, description, powerToughness, author, copyright, imageUrl, className, forceFavActive }) {

  const [isFavorited, setIsFavorited] = useState(false);
  const [card, setCard] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  const toggleFav = () => {
    const cardObj = { id: card?.id ?? id, title: card?.title ?? title };
    const nowFav = toggleFavorite(cardObj);
    setIsFavorited(nowFav);
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
    const loadCard = async () => {
      try {
        setCard(true); // loading state
        const base = "http://localhost:3001";
        if (id) {
          const res = await fetch(`${base}/cards/${id}`);
          const json = await res.json();
          setCard(json.card);
        } else {
          const res = await fetch(`${base}/cards`);
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            const firstId = json[0].id;
            const res2 = await fetch(`${base}/cards/${firstId}`);
            const json2 = await res2.json();
            setCard(json2.card);
          } else {
            setCard(null);
          }
        }
      } catch (error) {
        console.error("Errore nel caricamento della carta:", error);
        setCard(null);
      }
    };
    loadCard();
  }, [id]);

  // display prende i dati dal fetch se disponibili, altrimenti usa le prop ricevute
  const display = (card && typeof card === 'object') ? card : {
    id,
    title,
    manaCost,
    category,
    description,
    imageUrl: "/public/sfondo2.jpg",
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

    // 4) fallback: cerca parole nel testo (title/category/description)
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
            <img src= "/public/sfondo2.jpg" alt={display.title} />
          </div>
          <div className="categoryCard">
            <h5>{display.category}</h5>
          </div>
          <div className="descriptionCard">
            <p>
              {display.description}
            </p>
            <div className="forzaCard">{display.power ? `${display.power}/${display.toughness}` : powerToughness}</div>
          </div>
        </div>
        <div className="authorCard">{display.artist ?? author}</div>
        <div className="authorCard authorCardC">Copyright: {display.set ?? copyright}</div>
        <button 
        className={`favBtn ${favActive ? "colorActive" : ""}`}
        onClick={(e) => { e.stopPropagation(); toggleFav(); }} 
        aria-label="Aggiungi ai preferiti" 
        tabIndex={-1}>

          <img src="/public/iconHeart.png" alt="Aggiungi ai preferiti" className="heartIcon"/>
        </button>
      </div>
    </>
  );
}
export default Card;
