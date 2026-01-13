//! Importo le dipendenze necessarie da React Router e Chalk
import { Link } from "react-router-dom";
import chalk from "chalk";

const NotFound = () => {
  return (

    console.log(`${chalk.red("Ti sei perso nel multiverso delle carte, Viandante dimensionale?")} poco importa, perché qui non c'è nulla da vedere...`),
    console.log(`${chalk.red("Io sono Nicol Bolas e questo è il mio regno e tu sei pregato di andartene subito!")}`),
    
   <div className="notFoundPage">
      <div className="notFoundCard">
        <div className="notFoundCode">404</div>
        <h1 className="notFoundTitle">Portale non trovato</h1>
        <p className="notFoundText">
          Mi dispiace Viandante dimensionale, ma la rotta che stai cercando di raggiungere non esiste.
        </p>
        <p className="notFoundHint">
          Puoi tornare sulla via principale o esplorare tutte le carte disponibili.
        </p>
        <div className="notFoundActions">
          <Link to="/" className="notFoundBtn notFoundBtnPrimary">
            Torna alla Home
          </Link>
          <Link to="/tutte-le-carte" className="notFoundBtn notFoundBtnSecondary">
            Vai a tutte le carte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
