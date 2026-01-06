const Home = () => {
  return (
  <>
    <div className="hero">
        <div className="novita">
          <img src="./vampire.jpg" alt="Vampiri" />
          <div className="testo-novita">
            <h2>Novità in arrivo!</h2>
            <p>Scopri la nuova espansione <br /> <strong className="goldStrong">"Vampiri di Innistrad"</strong></p>
            <p>Immergiti nell'oscurità e vivi l'emozione di questa avventura gotica.</p>
          </div>
        </div>
           <div className="novita secondaria">
          <img src="/public/torneo.jpg" alt="Vampiri" />
          <div className="testo-novita">
            <h2>Prossimo torneo</h2>
            <p>Non perderti il prossimo torneo<br /> <strong className="goldStrong">"Magic Word Champion 2026"</strong></p>
            <p>Ospite speciale: <strong className="goldStrong">John Doe</strong></p>
          </div>
        </div>
    </div>
  </>
  )
};
export default Home;
