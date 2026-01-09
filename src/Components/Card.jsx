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

  // sinronizza stato preferito quando cambia la carta mostrata
  useEffect(() => {
    setIsFavorited(isFavorite(display.id));
  }, [display.id]);

  // if `forceFavActive` is provided, use it to determine the active class
  const favActive = typeof forceFavActive === 'boolean' ? forceFavActive : isFavorited;



  return (
    <>
        <div ref={containerRef} className={`cards ${className ?? ''} ${expanded ? 'expanded' : ''}`} onClick={handleContainerClick}>
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
