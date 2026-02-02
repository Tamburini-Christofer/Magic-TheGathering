//! Importazione delle dipendenze necessarie da React
import { useState, useEffect, useRef } from "react";
import chalk from "chalk";

//! Easter Egg di benvenuto nella console del browser
console.log(`Benvenuto nella mia pagina personale di ${chalk.yellow("Magic: The Gathering")}, mio amico ${chalk.yellow("Placewalker")}`);

//! Variabile che contiene un array di oggetti e rappresenta le novità della pagina a carosello
const heroSlides = [
  {
    id: "lorwyn",
    headline: "The Lord of The Rings",
    kicker: "Nuova espansione",
    tagline:
      "Scopri la nuova espansione ispirata al leggendario mondo di Tolkien, con oltre 280 carte uniche e potenti.",
    background: "/public/Sfondi/sfondoCaroselloTlotr.jpg",
    primaryCta: "INFORMAZIONI",
    secondaryCta: "PREORDINA SUBITO",
    hasOverlay: false,
  },
  {
    id: "torneo",
    headline: "Magic World Championship 2026",
    kicker: "Ospite speciale: Augusto: il maestro",
    tagline:
      "Partecipa al prossimo grande torneo e dimostra di essere il planeswalker più forte del multiverso.",
    background: "/public/Sfondi/sfondoCaroselloWorldChampions.webp",
    primaryCta: "SCOPRI I TORNEI",
    secondaryCta: "ISCRIVITI ORA",
    hasOverlay: false,
  },
  {
    id: "arena",
    headline: "Gioca subito su Arena",
    kicker: "Gioca online",
    tagline:
      "Costruisci i tuoi mazzi, affronta amici e sfidanti da tutto il mondo e tieni il passo con tutte le uscite.",
    background: "/public/Sfondi/sfondoCaroselloArena .jpg",
    primaryCta: "PRENOTA ORA",
    secondaryCta: "SCOPRI DI PIÙ",
    hasOverlay: false,
  },
    {
    id: "SuperClassName",
    headline: "Super Class Name 148",
    kicker: "Nuova Espansione",
    tagline:
      "Scopri la nuova espansione ispirata alla leggendaria saga di Super Class Name, con oltre 280 carte uniche e potenti.",
    background: "/public/148Edition/Pack148.png",
    primaryCta: "PRENOTA ORA",
    secondaryCta: "SCOPRI DI PIÙ",
    hasOverlay: true,
  },
];
//!

//! Creazione del componente HomePage
const HomePage = () => {

  //! Variabili di stato necessari per il carosello e l'overlay
  const [currentIndex, setCurrentIndex] = useState(0);                              //* Indice della slide corrente
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);                        //* Stato dell'overlay di novità                            
  const [isTransitioning, setIsTransitioning] = useState(false);                    //* Stato di transizione tra le slide 

  //! Ref per gestire il timeout delle transizioni
  const transitionTimeoutRef = useRef(null);                                        //* Riferimento al timeout di transizione */

  const currentSlide = heroSlides[currentIndex];
  const lotrSlide = heroSlides.find((s) => s.id === "lorwyn");

  //! Funzioni per gestire l'apertura e la chiusura dell'overlay e la navigazione tra le slide
  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };
  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };
  //!

  //! Funzione per navigare tra le slide del carosello
  const goToSlide = (index) => {
    if (isTransitioning) return;                                                     //* Evita di cambiare slide durante la transizione

    let nextIndex = index;
    if (nextIndex < 0) {                                                             //* Permette un loop infinito tra le slide              
      nextIndex = heroSlides.length - 1;                                             
    } else if (nextIndex >= heroSlides.length) {                                     //* Permette un loop infinito tra le slide   
      nextIndex = 0;
    }

    //? Gestione della transizione tra le slide
    setIsTransitioning(true);
    if (transitionTimeoutRef.current) {                                              //* Se esiste un timeout precedente, lo cancella
    clearTimeout(transitionTimeoutRef.current);
    }

    //!? Imposto un timeout per completare la transizione
    transitionTimeoutRef.current = setTimeout(() => {                                //* Dopo 500ms aggiorna la slide corrente */
    setCurrentIndex(nextIndex);
    setIsTransitioning(false);
    }, 500);
  };

  //! Effetto per l'autoplay del carosello ogni tot secondi
  useEffect(() => { 
      const timer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 20000);

      return () => clearInterval(timer);
  }, [currentIndex]);

  //! Effetto per pulire il timeout alla chiusura del componente
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {                                             //* Pulisce il timeout se esiste
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className={`hero ${isTransitioning ? "hero--transitioning" : ""}`.trim()}
        style={{ backgroundImage: `url('${currentSlide.background}')` }}
      >
        <div className="heroOverlayGradient" />

        <div className="heroContentWrap">
          <div className="heroTextBlock">
            <p className="heroKicker">{currentSlide.kicker}</p>
            <h1 className="heroTitle">{currentSlide.headline}</h1>
            <p className="heroTagline">{currentSlide.tagline}</p>

            <div className="heroButtons">
              <button
                type="button"
                className="heroBtn heroBtnPrimary"
                onClick={() => {
                goToSlide((currentIndex + 1) % heroSlides.length);
                }}
              >
                {currentSlide.primaryCta}
              </button>
              <button
                type="button"
                className="heroBtn heroBtnSecondary"
                onClick={() => {
                  if (currentSlide.id === "SuperClassName") {
                    handleOpenOverlay();
                    return;
                  }
                  goToSlide((currentIndex + 1) % heroSlides.length);
                }}
              >
                {currentSlide.secondaryCta}
              </button>
            </div>
          </div>
        </div>

        <div className="heroDots">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={
                index === currentIndex
                  ? "heroDot heroDot--active"
                  : "heroDot"
              }
              onClick={() => goToSlide(index)}
              aria-label={`Vai alla slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="heroArrows">
          <button
            type="button"
            className="heroArrowBtn"
            onClick={() => goToSlide(currentIndex - 1)}
            aria-label="Slide precedente"
          >
            ←
          </button>
          <button
            type="button"
            className="heroArrowBtn"
            onClick={() => goToSlide(currentIndex + 1)}
            aria-label="Slide successiva"
          >
            →
          </button>
        </div>
      </div>

      {isOverlayOpen && lotrSlide && (
        <div className="novita-overlay" onClick={handleCloseOverlay}>
          <div className="novita-overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="novita-overlay-close" type="button" onClick={handleCloseOverlay}>
              ✕
            </button>

            <div className="novita-overlay-left">
              <img
                src="/public/148Edition/Bustine148.png"
                alt="Booster Super Class Name 148"
                className="imgExp"
              />
            </div>

            <div className="novita-overlay-right">
              <h2>Super Class Name 148: l'assedio del Colosseo</h2>
              <p>
                Una nuova espansione ad alto impatto, ispirata all'evento cult Super Class
                Name 148: gladiatori, leggende urbane e magie proibite che scuotono le
                fondamenta di Roma.
              </p>
              <ul>
                <li>
                  Data di uscita: <strong style={{ color: "var(--Gold)" }}>Primavera 2026</strong>
                </li>
                <li>
                  Oltre <strong style={{ color: "var(--Gold)" }}>280 carte</strong> ognuna inedita
                </li>
                <li>
                  <strong style={{ color: "var(--Gold)" }}>+ di 20 nuovi Planeswalker</strong>
                </li>
                <li>
                  Formato: <strong style={{ color: "var(--Gold)" }}>Standard, Draft, Sealed</strong>
                </li>
              </ul>
              <p>
                Scegli la tua fazione tra guardiani del Colosseo e invasori dimensionali,
                costruisci il tuo mazzo tematico e preparati alla battaglia definitiva sotto
                le luci della città eterna.
              </p>
              <div className="novita-overlay-ctaRow">
                <button type="button" className="heroBtn heroBtnPrimary novita-overlay-btn">
                  Preordina il bundle
                </button>
                <button type="button" className="heroBtn heroBtnSecondary novita-overlay-btn">
                  Guarda le prime carte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
