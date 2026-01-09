//! Importo le dipendenze necessarie da React Router e il componente Layout
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//! Importo il componente Layout
import Layout from "./Layout/Layout.jsx";

//! Importo le pagine dell'applicazione
import Home from "./Pages/HomePage.jsx";
import Carte from "./Pages/TutteCarte.jsx";
import Preferiti from "./Pages/Preferiti.jsx";

//! Importo i file CSS per lo stile dell'applicazione
import "./Styles/App.css";
import "./Styles/NavBar.css";
import "./Styles/HomePage.css";
import "./Styles/TutteCarte.css";
import "./Styles/Preferiti.css";
import "./Styles/CartaSingola.css";
import "./Styles/Footer.css";

//! Definisco il componente principale dell'applicazione
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tutte-le-carte" element={<Carte />} />
            <Route path="le-mie-preferite" element={<Preferiti />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
