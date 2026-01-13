//! Importazione delle librerie necessarie da React Router
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFavorites } from "../utils/favorites";

//todo Definizione delle pagine di navigazione con le rispettive rotte e etichette
const linkPages = [
  { route: "/", label: "Home" },
  { route: "/tutte-le-carte", label: "Tutte le carte" },
  { route: "/le-mie-preferite", label: "Le mie preferite" },
];

//todo Creazione del componente NavBar con logo e menu di navigazione
const NavBar = () => {
  const [preferiti, setPreferiti] = useState(0);
  const aggiungiPreferito = () => setPreferiti((p) => p + 1);

  useEffect(() => {

    //todo  inizializza il conteggio dai dati in localStorage

    setPreferiti(getFavorites().length);

    const handler = () => setPreferiti(getFavorites().length);
    window.addEventListener("favoritesChanged", handler);
    return () => window.removeEventListener("favoritesChanged", handler);
  }, []);

  
  return (
    <>
      <div>
        <nav>
          <div className="navBar">
                  <a href="/"><img className="logo" src="/public/logo/magic-logo.webp" alt="Magic logo" /></a>
            <ul> {linkPages.map((link, i) => (
              <li key={i}>
                <NavLink to={link.route}>{link.label}</NavLink>
              </li>
            ))}</ul>

            <div className="navActions">
              <NavLink to="/le-mie-preferite" className="heartLink">
                <span className="heartBadge">{preferiti}</span>
                <img src="/public/logo/iconHeart.png" alt="Preferiti" className="navHeart" />
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
export default NavBar;
