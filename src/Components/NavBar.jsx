//! Importazione delle librerie necessarie da React Router
import { NavLink, useNavigate } from 'react-router-dom';

const linkPages = [
  { route: '/HomePage', label: 'Home Page' },
  { route: '/Tuttelecarte', label: 'Tutte le carte' },
  { route: '/Lemiepreferite', label: 'Le mie preferite' },
  { route: '/Login', label: '/Login' },
];

//todo Creazione del componente NavBar con logo e menu di navigazione
const NavBar = () => (
  <>
   <div className="navBar">
     <img src="/magic-logo.png" alt="Logo" />
     <nav>
        <ul>
            {linkPages.map((link, i) => (
              <li key={i}>
                <NavLink 
                to={link.route}
                >{link.label}
                </NavLink>
              </li>
            ))} 
        </ul>
     </nav>
   </div>
  </>
);

export default NavBar;
