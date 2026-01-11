import chalk from "chalk";
import { useState, useEffect } from "react";

console.log(`Benvenuto nella mia pagina personale di ${chalk.yellow("Magic: The Gathering")}, mio amico ${chalk.yellow("Placewalker")}`);

const HomePage = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (!videoFile) {
      return;
    }

    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  return (
    <>
      <div className="hero">
        <div className="novita" onClick={handleOpenOverlay}>
          <img src="/public/Screenshot 2026-01-11 041049.png" alt="Vampiri" />
          <div className="testo-novita">
            <h2>Novità in arrivo!</h2>
            <p>
              Scopri il nuovo set <br /> <strong className="goldStrong">"SuperClassName148"</strong>
            </p>
            <p>Scegli la tua fazione e combatti per il destino del nostro paese</p>
          </div>
        </div>
        <div className="novita secondaria">
          <img src="/public/torneo.jpg" alt="Vampiri" />
          <div className="testo-novita">
            <h2>Prossimo torneo</h2>
            <p>
              Non perderti il prossimo torneo
              <br /> <strong className="goldStrong">"Magic Word Champion 2026"</strong>
            </p>
            <p>
              Ospite speciale: <strong className="goldStrong">John Doe</strong>
            </p>
          </div>
        </div>
      </div>

      {isOverlayOpen && (
        <div className="novita-overlay" onClick={handleCloseOverlay}>
          <div className="novita-overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="novita-overlay-close" type="button" onClick={handleCloseOverlay}>
              ✕
            </button>

            <div className="novita-overlay-left">
              <label className="novita-upload-area">
  
              </label>
              {videoUrl && (
                <video className="novita-video-preview" src={videoUrl} controls />
              )}
            </div>

            <div className="novita-overlay-right">
              <h2>Nuovo set: SuperClassName148!</h2>
              <p>
                Sceglierai di unirti a CarcolaMan e difendere Roma o sceglierai Tankboy per distruggerla?
              </p>
              <ul>
                <li>Data di uscita: <strong style={{color: "var(--Gold)"}}>Primavera 2026</strong></li>
                <li>Oltre <strong style={{color: "var(--Gold)"}}>280 carte</strong> ognuna inedita</li>
                <li><strong style={{color: "var(--Gold)"}}>+ di 20 nuovi PlaneWalker</strong></li>
                <li>Formato: <strong style={{color: "var(--Gold)"}}>Standard, Draft, Sealed</strong></li>
              </ul>
              <p>
                Scegli la tua fazione, costruisci il tuo mazzo e preparati alla battaglia definitiva.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
