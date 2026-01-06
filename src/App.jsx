//! Importo le dipendenze necessarie da React Router e il componente Layout
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout.jsx";
import Home from "./Pages/Home.jsx";
import Carte from "./Pages/Carte.jsx";
import Preferiti from "./Pages/Preferiti.jsx";

import './Styles/App.css'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}></Route>
          <Route index element={<Home />}></Route>
          <Route path="Tutte le carte" element={<Carte />}></Route>
          <Route path="Le mie preferite" element={<Preferiti />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
