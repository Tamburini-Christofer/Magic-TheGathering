function Cards() {
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
        <span className="authorCard">John Wick 1992</span>

        <button className="favBtn" aria-label="Aggiungi ai preferiti" tabIndex={-1}>
          <img src="/public/iconHeart.png" alt="Aggiungi ai preferiti" className="heartIcon" />
        </button>
      </div>
    </>
  );
}
export default Cards;
