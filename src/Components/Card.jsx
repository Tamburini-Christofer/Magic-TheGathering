import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "../utils/favorites";


function Card() {

  const [isFavorited, setIsFavorited] = useState(false);

  // generiamo un id semplice per questa demo (meglio passare `id` come prop)
  const cardId = `card-${Math.random().toString(36).slice(2,9)}`;

  const toggleFav = () => {
    const cardObj = { id: cardId, title: "Eldrazi" };
    const nowFav = toggleFavorite(cardObj);
    setIsFavorited(nowFav);
    // notifico NavBar e altri listener che la lista è cambiata
    window.dispatchEvent(new CustomEvent("favoritesChanged"));
  };

  useEffect(() => {

  }, []);



  return (
    <>
      <div className="cards">
        <div className="sopraSfondo">
          <div className="titleCard">
            <h4>Eldrazi</h4>
            <div></div>
            <div className="costMana">10</div>
          </div>
          <div className="imgCard">
            <img src="/public/sfondo.webp" alt="" />
          </div>
          <div className="categoryCard">
            <h5>categoria</h5>
          </div>
          <div className="descriptionCard">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              culpa labore incidunt dolores, corrupti animi consequatur amet
              alias, blanditiis quas, voluptas eligendi ratione sapiente. Quia
              nam exercitationem quasi sint qui.
            </p>
            <div className="forzaCard">2/2</div>
          </div>
        </div>
        <div className="authorCard">John Wick 1992</div>
        <div className="authorCard authorCardC">Copyright: Magic The Gathering</div>

        <button 
        className={`favBtn ${isFavorited ? "colorActive" : ""}`}
        onClick={toggleFav} 
        aria-label="Aggiungi ai preferiti" 
        tabIndex={-1}>

          <img src="/public/iconHeart.png" alt="Aggiungi ai preferiti" className="heartIcon"/>
        </button>
      </div>
    </>
  );
}
export default Card;
