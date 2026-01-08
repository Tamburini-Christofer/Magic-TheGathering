//! Importazione delle librerie necessarie da React Router
import { NavLink } from "react-router-dom";

//todo Definizione delle pagine di navigazione con le rispettive rotte e etichette
const linkPages = [
  { route: "/", label: "Home" },
  { route: "/tutte-le-carte", label: "Tutte le carte" },
  { route: "/le-mie-preferite", label: "Le mie preferite" },
];

//todo Creazione del componente NavBar con logo e menu di navigazione
const NavBar = () => {
  return (
    <>
      <div>
        <nav>
          <div className="navBar">
                <img className="logo" src="/magic-logo.webp" alt="Magic logo" />
            <ul> {linkPages.map((link, i) => (
              <li key={i}>
                <NavLink to={link.route}>{link.label}</NavLink>
              </li>
            ))}</ul>

            <div className="navActions">
              <NavLink to="/le-mie-preferite" className="heartLink">
                <span className="heartBadge">0</span>
                <img src="/public/iconHeart.png" alt="Preferiti" className="navHeart" />
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
export default NavBar;
